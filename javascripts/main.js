var E = function(tagName, attributes, children) {
      var element = document.createElement(tagName);
    if (attributes) {
        for (key in attributes) {
            if (/^data-/.test(key)) {
                element.setAttribute(key, attributes[key]);
            }
            else {
                element[key] = attributes[key];
            }
        }
    }
    if (children instanceof Array) {
        for (var i = 0; i < children.length; ++i) {
            if (typeof children[i] === 'string') {
                children[i] = document.createTextNode(children[i]);
            }
            element.appendChild(children[i]);
        }
    }

    return element;
};

var englishMonthString = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
var toEnglishDateString = function(date) {
    return englishMonthString[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
};

var loadFeed = function(feedUrl, containerId, params) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      var entries = JSON.parse(xhr.responseText).items;
      var container = document.getElementById(containerId).getElementsByClassName('feed')[0];
      container.setAttribute('class', container.className + ' loaded');
      for (var i = 0; i < Math.min(entries.length, params['count'] || 3); ++i) {
        var entry = entries[i];
        var div = E('div', { className: 'entry' },
                    [E('div', { className: 'entry-date' }, [toEnglishDateString(new Date(entry.pubDate))]),
                     E('div', { className: 'entry-title' }, [
                       E('a', { href: entry.link }, [entry.title])
                     ]),
                     E('p', { className: 'entry-body' }, [entry.description])]);
        loadBookmarkCount(div, entry.link);

        container.appendChild(div);
      }
    }
  };
  xhr.open('GET', "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(feedUrl));
  xhr.send();
};

var loadBookmarkCount = function(entryEl, url) {
    var span = E('span', { className: 'entry-bookmark-count' }, [
        E('a', { href: 'http://b.hatena.ne.jp/entry/' + encodeURI(url.replace(/^https?:\/\//, '')), className: 'hatena-bookmark-button', 'data-hatena-bookmark-layout': 'simple-balloon' }, [
            E('img', { src: 'https://b.st-hatena.com/images/entry-button/button-only@2x.png', width: 20, height: 20, style: 'border: none;' })
        ])]);
    entryEl.getElementsByClassName('entry-title')[0].appendChild(span);
};

var getReposInfo = function(fullName) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            var repos = JSON.parse(xhr.responseText);
            var el = document.getElementById('repos-' + repos['name']);
            if (el) {
                addStarCount(repos, el);
            }
        }
    };
    xhr.open('GET', 'https://api.github.com/repos/' + fullName);
    xhr.send();
};

var loadStarCounts = function() {
    var repos = document.getElementsByClassName('repos');
    for (var i = 0; i < repos.length; ++i) {
        getReposInfo(repos[i].getAttribute('data-repos-name'));
    }
};

var addStarCount = function(repos, el) {
    var div = E('div', { className: 'starred' },
                [E('a', { href: repos['html_url'] },
                   [E('img', { src: 'images/github-icon.png' })])]);
    if (repos['stargazers_count'] !== 0) {
        div.appendChild(E('span', { className: 'starred-count' }, ['' + repos['stargazers_count']]));
    }
    el.getElementsByTagName('dt')[0].appendChild(div);
};

var loading = function() {
    var loadings = document.getElementsByClassName('loading');
    var dots = 2;
    var i = 0;
    setInterval(function() {
        var msg = "Loading";
        for (i=0; i<dots; ++i) {
            msg = msg + ".";
        }
        for (i=0; i<loadings.length; ++i) {
            loadings[i].innerHTML = msg;
        }
        if (dots < 5) {
            ++dots;
        }
        else {
            dots = 0;
        }
    }, 500);
};
