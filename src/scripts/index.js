
/* BobYang's Website */

Q.reg('Home', function(){
	var html = document.getElementById('rHome').outerHTML;
	document.getElementById('rMain').innerHTML = html;
});

Q.reg('Bangumi', function(){
	var html = document.getElementById('rBangumi').outerHTML;
	document.getElementById('rMain').innerHTML = html;
	getBangumi('./bangumi/bangumi.md');
});

Q.reg('Posts', function(){
	var html = document.getElementById('rPosts').outerHTML;
	document.getElementById('rMain').innerHTML = html;
	getPosts(config.user, config.repo);
});

Q.reg('Post', function(pid) {
	var html = document.getElementById('rPost').outerHTML;
	document.getElementById('rMain').innerHTML = html;
	getPost(config.user, config.repo, pid)
});

Q.reg('Projects', function(){
	var html = document.getElementById('rProjects').outerHTML;
	document.getElementById('rMain').innerHTML = html;
	getProjects(config.user);
});

Q.reg('Links', function(){
	var html = document.getElementById('rLinks').outerHTML;
	document.getElementById('rMain').innerHTML = html;
	getLinks('./links/links.md');
});

// Init routes
Q.init({
	index: "Home"
});

function getProjects(username) {
  var xhr = new XMLHttpRequest();
  var apiAddress = 'https://api.github.com/users/' + username + '/repos';
  xhr.open('GET', apiAddress, true);
  xhr.send();
  xhr.onload = function () {
    var apiCallback = JSON.parse(xhr.responseText);
    console.log(apiCallback);
    var apiCallbackJsonLength = apiCallback.length;
    var apiDataPrint = '<ul>';

    for (var i = 0; i < apiCallbackJsonLength; i++) {
      if (apiCallback[i].archived) {
        apiDataPrint += '<li class="bob-projects-gh-archived">';
      } else {
        apiDataPrint += '<li>';
      };

      apiDataPrint += 
        `<a href="` + apiCallback[i].html_url + '">' + 
          apiCallback[i].name + 
        `</a><br>` +
        `<small>` + apiCallback[i].description + `</small><br>` + 
        `<code>Star ` + apiCallback[i].stargazers_count + `</code> <code>Fork ` + apiCallback[i].forks_count + `</code>` +
      `</li>`;
    };

    apiDataPrint += '</ul>';
    document.getElementById('projects').innerHTML = apiDataPrint;
  }; 
};

function getBangumi(mdPath) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', mdPath, true);
  xhr.send();
  xhr.onload = function () {
    document.getElementById('bangumi').innerHTML = marked.parse(xhr.responseText);
  };
};

function getLinks(mdPath) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', mdPath, true);
  xhr.send();
  xhr.onload = function () {
    document.getElementById('links').innerHTML = marked.parse(xhr.responseText);
  };
};

function getPosts(username, repo) {
  var xhr = new XMLHttpRequest();
  var apiAddress = 'https://api.github.com/repos/' + username + '/' + repo + '/issues';
  xhr.open('GET', apiAddress, true);
  xhr.send();
  xhr.onload = function () {
    var apiCallback = JSON.parse(xhr.responseText);
    console.log(apiCallback);
    var apiCallbackJsonLength = apiCallback.length;

    var apiDataPrint = `<ul>`;

    for (var i = 0; i < apiCallbackJsonLength; i++) {
      if (apiCallback[i].user.login == username) {
        apiDataPrint += 
        `<li>` +
          `<a href="./#!Post/` + apiCallback[i].number + `">` + apiCallback[i].title + `</a>` +
        `</li>`;
      };
    };

    apiDataPrint += `</ul>`;
    document.getElementById('posts').innerHTML = apiDataPrint;
  }; 
};

function getPost(username, repo, id) {
  var xhr = new XMLHttpRequest();
  var apiAddress = 'https://api.github.com/repos/' + username + '/' + repo + '/issues';
  xhr.open('GET', apiAddress, true);
  xhr.send();
  xhr.onload = function () {
    var apiCallback = JSON.parse(xhr.responseText);
    console.log(apiCallback);
    var apiCallbackJsonLength = apiCallback.length;
		var apiCallbackId = apiCallbackJsonLength - id

    var apiDataPrint = '';

    if (apiCallback[apiCallbackId].user.login == username) {
      apiDataPrint += 
      `<div>` +
      	`<h2 class="bob-post-title">` + apiCallback[apiCallbackId].title + `</h2>` +
      	`<div class="typo">` +
        	marked.parse(apiCallback[apiCallbackId].body) +
        `</div>` +
        `<small class="bob-post-links"><a href="` + apiCallback[apiCallbackId].html_url + `">Post on GitHub</a></small>` +
      `</div>`;
    };

    document.getElementById('post').innerHTML = apiDataPrint;
  }; 
};
