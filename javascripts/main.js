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
    params = params || {
        numEntries: 3
    };

    google.load('feeds', '1');
    google.setOnLoadCallback(function() {
        var feed = new google.feeds.Feed(feedUrl);
        feed.setNumEntries(params['numEntries']);

        feed.load(function(result){
            if (result.error) {
                return;
            }
            var container = document.getElementById(containerId).getElementsByClassName('feed')[0];
            for (var i = 0; i < result.feed.entries.length; ++i) {
                var entry = result.feed.entries[i];
                var div = E('div', { className: 'entry' },
                            [E('div', { className: 'entry-date' }, [toEnglishDateString(new Date(entry.publishedDate))]),
                             E('div', { className: 'entry-title' }, [
                                 E('a', { href: entry.link }, [entry.title])
                             ]),
                             E('p', { className: 'entry-body' }, [entry.contentSnippet])]);
                loadBookmarkCount(div, entry.link);

                container.appendChild(div);
            }
        });
    });
};

var loadBookmarkCount = function(entryEl, url) {
    var span = E('span', { className: 'entry-bookmark-count' }, [
        E('a', { href: 'http://b.hatena.ne.jp/entry/' + encodeURI(url.replace(/^https?:\/\//, '')), className: 'hatena-bookmark-button', 'data-hatena-bookmark-layout': 'simple-balloon' }, [
            E('img', { src: 'http://b.st-hatena.com/images/entry-button/button-only@2x.png', width: 20, height: 20, style: 'border: none;' })
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
