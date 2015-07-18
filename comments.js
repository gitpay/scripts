var WebSocket = require('ws');
var exec      = require('child_process').exec;
var $rdf      = require('rdflib');
var https     = require('https');
var sha256    = require('sha256');
var GitHubApi = require("github");


var port   = 443;
var wallet = process.argv[2] || 'https://localhost/etc/wallet/github.com/linkeddata/SoLiD/wallet';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';




// Globals
var __kb;
var __profile;
var PROXY = "https://rww.io/proxy.php?uri={uri}";
var AUTH_PROXY = "https://rww.io/auth-proxy?uri=";
var TIMEOUT = 1000;
var DEBUG = true;
// Namespaces
var RDF    = $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
var RDFS   = $rdf.Namespace("http://www.w3.org/2000/01/rdf-schema#");
var FOAF   = $rdf.Namespace("http://xmlns.com/foaf/0.1/");
var OWL    = $rdf.Namespace("http://www.w3.org/2002/07/owl#");
var SPACE  = $rdf.Namespace("http://www.w3.org/ns/pim/space#");
var SCHEMA = $rdf.Namespace("https://schema.org/");
var UI     = $rdf.Namespace("http://www.w3.org/ns/ui#");
var DCT    = $rdf.Namespace("http://purl.org/dc/terms/");
var CERT   = $rdf.Namespace("http://www.w3.org/ns/auth/cert#");
var CURR   = $rdf.Namespace("https://w3id.org/cc#");
var ACL    = $rdf.Namespace("http://www.w3.org/ns/auth/acl#");
var LDP    = $rdf.Namespace("http://www.w3.org/ns/ldp#");
var URN    = $rdf.Namespace("urn:");

$rdf.Fetcher.crossSiteProxyTemplate=PROXY;
var g = $rdf.graph();
var f = $rdf.fetcher(g, TIMEOUT);

//<#rules>
//    <https://schema.org/codeRepository> <https://github.com/linkeddata/SoLiD#this> ;
//    <https://schema.org/owner> <https://github.com/linkeddata/SoLiD#this> ;
//    <urn:distributionBot> <https://workbot.databox.me/profile/card#me> ;
//    <urn:perCommit> "500" ;
//    <urn:perIssue> "100" .

var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    debug: true,
    protocol: "https",
    host: "api.github.com", // should be api.github.com for GitHub
    timeout: 5000,
    headers: {
        "user-agent": "My-Cool-GitHub-App" // GitHub is happy with a unique user agent
    }
});



var commits = [];
var users = {};
var page = 1;
var source = 'https://workbot.databox.me/profile/card#me';
var amount = 100;
var repo = "SoLiD";
var user = "linkeddata";
var timeout = 0;
var commands = [];

f.requestURI(wallet,undefined,true, function(ok, body, xhr) {

  function update () {
    var command = commands.pop();
    exec(command, function(error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });

  }


  function finish() {
    for (i=0; i<commits.length; i++) {
      var commit = commits[i];
      var author = users[commit.user.html_url + '#this'];
      if (!author) continue;
      var distributionBot = 'https://workbot.databox.me/profile/card#me';
      var currency = 'https://w3id.org/bits';
      var command = ' nodejs insert.js "' + distributionBot + '" ' + amount + ' "' + currency + '" "' + author + '" "' + commit.url + '" any';
      console.log(command);
      commands.push(command);
      timeout += 500;
      setTimeout(update, timeout);
    }
  }


  function callback(err, res) {
    for (var i=0; i<res.length; i++) {
      console.log(res[i].url);
      commits.push(res[i]);
    }

    var next = github.hasNextPage(res);
    //console.log(next);
    page++;

    if (next) {

        github.issues.repoComments({
          user: user,
          repo: repo,
          per_page: 100,
          page: page
      }, callback);

    } else {
      finish();
    }

  }


  var repository = g.any( $rdf.sym(wallet + "#rules"), SCHEMA('codeRepository') );
  if (repository) repository = repository.value;
  var points = g.any( $rdf.sym(wallet + "#rules"), URN('perComment'), undefined );

console.log(points);
  if (points) amount = points.value;
  var reg = /^https:\/\/github.com\/(.*)\/(.*)#this$/.exec(repository);
  console.log(repository);
  if ( reg && reg.length === 3 ) {
    user = reg[1];
    repo = reg[2];
  } else {
    return;
  }
  console.log(repo);
  var u = g.statementsMatching( undefined, OWL('sameAs') );
  for (var i=0; i<u.length; i++) {
    users[u[i].object.value] = u[i].subject.value;
  }
  console.log(users);

  if (repo) {

      github.issues.repoComments({
        user: user,
        repo: repo,
        per_page: 100,
        page: page,
    }, callback);

  }

});
