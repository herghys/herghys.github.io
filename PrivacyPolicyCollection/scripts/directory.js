(function () {
    var REPO_API = 'https://api.github.com/repos/herghys/herghys.github.io/contents/PrivacyPolicyCollection';
    var CACHE_KEY = 'herghys_privacy_policies_v1';
    var IGNORED_DIRS = { styles: true, scripts: true };

    var SDK_CATALOG = {
        'Google Play Services': {
            pattern: /google\s+play\s+services/i,
            role: 'App distribution & Android services',
            detail: 'Provides core Android platform features such as crash reporting, app updates, and Play Store integration. Data is governed by Google’s privacy policy.',
            url: 'https://www.google.com/policies/privacy/'
        },
        'AdMob': {
            pattern: /\badmob\b/i,
            role: 'In-app advertising',
            detail: 'Serves ads so the app can remain free to play. AdMob may use device advertising IDs and cookies to deliver relevant or non-personalized ads.',
            url: 'https://support.google.com/admob/answer/6128543?hl=en'
        },
        'Unity': {
            pattern: /\bunity\b/i,
            role: 'Game engine runtime & diagnostics',
            detail: 'Powers the game runtime and may collect anonymized device diagnostics (OS version, hardware specs) to help keep the game stable.',
            url: 'https://unity3d.com/legal/privacy-policy'
        },
        'Firebase': {
            pattern: /\bfirebase\b/i,
            role: 'App backend & crash analytics',
            detail: 'Provides authentication, analytics, or crash reporting services governed by Google Firebase privacy terms.',
            url: 'https://firebase.google.com/support/privacy'
        },
        'Google Analytics': {
            pattern: /google\s+analytics/i,
            role: 'Usage analytics',
            detail: 'Helps understand aggregate app usage and performance metrics.',
            url: 'https://policies.google.com/privacy'
        }
    };

    // Offline / rate-limit fallback so the page always renders immediately
    var FALLBACK_ENTRIES = [
        {
            slug: 'TapColored-Privacy-Policy',
            appName: 'Tap Colored',
            effectiveDate: '2026-11-26',
            effectiveLabel: 'Nov 26, 2026',
            sdks: ['Google Play Services', 'AdMob', 'Unity'],
            files: ['index.html', 'PrivacyPolicy.md']
        },
        {
            slug: 'Pong-Evolved-Privacy-Policy',
            appName: 'Pong Evolved',
            effectiveDate: '2026-11-23',
            effectiveLabel: 'Nov 23, 2026',
            sdks: ['Google Play Services', 'AdMob', 'Unity'],
            files: ['index.html', 'PrivacyPolicy.md']
        },
        {
            slug: 'Tap-Privacy-Policy',
            appName: 'Tap!',
            effectiveDate: '2023-05-06',
            effectiveLabel: 'May 6, 2023',
            sdks: ['Google Play Services', 'AdMob', 'Unity'],
            files: ['index.html', 'PrivacyPolicy.md']
        },
        {
            slug: 'IAPLearn-Privacy-Policy',
            appName: 'IAPLearn',
            effectiveDate: '2023-05-06',
            effectiveLabel: 'May 6, 2023',
            sdks: ['Google Play Services', 'AdMob', 'Unity'],
            files: ['index.html', 'PrivacyPolicy.md']
        }
    ];

    var state = {
        entries: loadCachedEntries() || FALLBACK_ENTRIES.slice(),
        selectedSlug: '',
        activeTab: 'overview',
        filter: '',
        sortAsc: true,
        markdownCache: {}
    };
    state.selectedSlug = state.entries.length ? state.entries[0].slug : '';

    var dirListEl = document.getElementById('dir-list');
    var dirCountEl = document.getElementById('dir-count');
    var filterInput = document.getElementById('dir-filter');
    var sortBtn = document.getElementById('sort-btn');
    var sortArrow = document.getElementById('sort-arrow');
    var readerTitle = document.getElementById('reader-title');
    var readerUpdated = document.getElementById('reader-updated');
    var readerPath = document.getElementById('reader-path');
    var readerBody = document.getElementById('reader-body');
    var copyUrlBtn = document.getElementById('copy-url-btn');
    var openStandaloneBtn = document.getElementById('open-standalone-btn');
    var tabButtons = Array.prototype.slice.call(document.querySelectorAll('.tab-btn'));

    if (!dirListEl || !readerBody) return;

    function loadCachedEntries() {
        try {
            var raw = sessionStorage.getItem(CACHE_KEY);
            if (!raw) return null;
            var parsed = JSON.parse(raw);
            return Array.isArray(parsed) && parsed.length ? parsed : null;
        } catch (e) {
            return null;
        }
    }

    function saveCachedEntries(list) {
        try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(list));
        } catch (e) {}
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function formatDateLabel(isoDate) {
        var parts = isoDate.split('-');
        if (parts.length !== 3) return isoDate;
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var monthIdx = parseInt(parts[1], 10) - 1;
        var day = parseInt(parts[2], 10);
        if (monthIdx < 0 || monthIdx > 11 || isNaN(day)) return isoDate;
        return months[monthIdx] + ' ' + day + ', ' + parts[0];
    }

    function parsePolicyHtml(slug, html) {
        var appName = slug.replace(/-Privacy-Policy$/i, '').replace(/-/g, ' ').trim();
        var mName = html.match(/built\s+the\s+(?:<[^>]+>\s*)?([^<\n]+?)(?:\s*<\/[^>]+>)?\s+app\b/i);
        if (mName) {
            appName = mName[1].replace(/\s+/g, ' ').trim();
        } else {
            var mTitle = html.match(/<title>\s*Privacy\s+Policy\s*[-—|:]\s*([^|<]+)/i);
            if (mTitle) appName = mTitle[1].replace(/\s+/g, ' ').trim();
        }

        var effectiveDate = '—';
        var effectiveLabel = 'See full page';
        var mDate = html.match(/effective\s+as\s+of\s+(?:<[^>]+>)*(\d{4}-\d{2}-\d{2})/i);
        if (mDate) {
            effectiveDate = mDate[1];
            effectiveLabel = formatDateLabel(effectiveDate);
        }

        var sdks = Object.keys(SDK_CATALOG).filter(function (name) {
            return SDK_CATALOG[name].pattern.test(html);
        });

        return {
            slug: slug,
            appName: appName,
            effectiveDate: effectiveDate,
            effectiveLabel: effectiveLabel,
            sdks: sdks.length ? sdks : ['Google Play Services', 'AdMob', 'Unity'],
            files: ['index.html', 'PrivacyPolicy.md']
        };
    }

    function folderIcon() {
        return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>';
    }

    function parentIcon() {
        return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg>';
    }

    function chevronIcon() {
        return '<svg class="sdk-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>';
    }

    function getVisibleEntries() {
        var q = state.filter.trim().toLowerCase();
        var list = state.entries.filter(function (item) {
            if (!q) return true;
            return item.appName.toLowerCase().indexOf(q) !== -1 ||
                item.slug.toLowerCase().indexOf(q) !== -1;
        });

        list.sort(function (a, b) {
            var cmp = a.appName.localeCompare(b.appName, undefined, { sensitivity: 'base' });
            return state.sortAsc ? cmp : -cmp;
        });

        return list;
    }

    function getSelectedEntry() {
        for (var i = 0; i < state.entries.length; i++) {
            if (state.entries[i].slug === state.selectedSlug) return state.entries[i];
        }
        return state.entries[0];
    }

    function getPolicyAbsoluteUrl(entry) {
        var base = window.location.href.split('#')[0].split('?')[0];
        if (base.slice(-10) === 'index.html') {
            base = base.slice(0, -10);
        }
        if (base.slice(-1) !== '/') base += '/';
        return base + encodeURIComponent(entry.slug) + '/';
    }

    function renderDirectory() {
        var visible = getVisibleEntries();
        var itemsHtml = [];

        itemsHtml.push(
            '<li class="dir-item">' +
                '<a class="dir-row" href="../">' +
                    '<span class="dir-icon parent">' + parentIcon() + '</span>' +
                    '<div class="dir-row-body">' +
                        '<div class="dir-row-title">' +
                            '<span class="dir-app-name">../</span>' +
                            '<span class="dir-date">Parent</span>' +
                        '</div>' +
                        '<div class="dir-folder-slug">Back to herghys.github.io</div>' +
                    '</div>' +
                '</a>' +
            '</li>'
        );

        if (visible.length === 0) {
            itemsHtml.push('<li class="dir-empty">No apps match "' + escapeHtml(state.filter) + '".</li>');
        } else {
            visible.forEach(function (entry) {
                var isSelected = entry.slug === state.selectedSlug;
                itemsHtml.push(
                    '<li class="dir-item">' +
                        '<button type="button" class="dir-row" role="option" data-slug="' + escapeHtml(entry.slug) + '" aria-selected="' + (isSelected ? 'true' : 'false') + '">' +
                            '<span class="dir-icon">' + folderIcon() + '</span>' +
                            '<div class="dir-row-body">' +
                                '<div class="dir-row-title">' +
                                    '<span class="dir-app-name">' + escapeHtml(entry.appName) + '</span>' +
                                    '<span class="dir-date">' + escapeHtml(entry.effectiveDate) + '</span>' +
                                '</div>' +
                                '<div class="dir-folder-slug">' + escapeHtml(entry.slug) + '/</div>' +
                            '</div>' +
                        '</button>' +
                    '</li>'
                );
            });
        }

        dirListEl.innerHTML = itemsHtml.join('');
        dirCountEl.textContent = visible.length + (visible.length === 1 ? ' app' : ' apps');
        sortArrow.innerHTML = state.sortAsc ? '&uarr;' : '&darr;';
    }

    function renderOverview(entry) {
        var sdks = entry.sdks || [];
        var sdkHtml = sdks.map(function (sdkName, idx) {
            var info = SDK_CATALOG[sdkName] || {
                role: 'Third-party service',
                detail: 'Third-party service used by this application.',
                url: '#'
            };
            var panelId = 'sdk-panel-' + idx;
            return (
                '<div class="sdk-item">' +
                    '<button type="button" class="sdk-toggle" aria-expanded="false" aria-controls="' + panelId + '">' +
                        '<span>' + escapeHtml(sdkName) + '<span class="sdk-toggle-meta">' + escapeHtml(info.role) + '</span></span>' +
                        chevronIcon() +
                    '</button>' +
                    '<div id="' + panelId + '" class="sdk-detail" hidden>' +
                        '<p>' + escapeHtml(info.detail) + '</p>' +
                        '<a href="' + escapeHtml(info.url) + '" target="_blank" rel="noopener noreferrer">Read ' + escapeHtml(sdkName) + ' Privacy Policy &rarr;</a>' +
                    '</div>' +
                '</div>'
            );
        }).join('');

        var fileList = Array.isArray(entry.files) && entry.files.length
            ? entry.files
            : ['index.html', 'PrivacyPolicy.md'];

        var filesLinksHtml = fileList.map(function (fileName) {
            var href = fileName === 'index.html'
                ? encodeURIComponent(entry.slug) + '/'
                : encodeURIComponent(entry.slug) + '/' + encodeURIComponent(fileName);
            return '<a class="btn-ui sm" href="' + href + '">' + escapeHtml(fileName) + '</a>';
        }).join('');

        return (
            '<div class="summary-grid">' +
                '<div class="fact-card">' +
                    '<div class="fact-label">Personal Data Stored by Us</div>' +
                    '<div class="fact-value">None (Device-only)</div>' +
                    '<div class="fact-note">Any data requested by ' + escapeHtml(entry.appName) + ' stays on your device and is not uploaded to Herghys Studio servers.</div>' +
                '</div>' +
                '<div class="fact-card">' +
                    '<div class="fact-label">Third-Party Services</div>' +
                    '<div class="fact-value">' + sdks.length + ' Active SDKs</div>' +
                    '<div class="fact-note">Used for distribution, crash diagnostics, and free-to-play ad support. Inspect each service below.</div>' +
                '</div>' +
                '<div class="fact-card">' +
                    '<div class="fact-label">Children’s Privacy</div>' +
                    '<div class="fact-value">Not targeted under 13</div>' +
                    '<div class="fact-note">We do not knowingly collect personal information from children under 13 years of age.</div>' +
                '</div>' +
                '<div class="fact-card">' +
                    '<div class="fact-label">Privacy Contact</div>' +
                    '<div class="fact-value"><a href="mailto:helmi.santosa1@gmail.com">helmi.santosa1@gmail.com</a></div>' +
                    '<div class="fact-note">Reach out directly for questions, data concerns, or removal requests.</div>' +
                '</div>' +
            '</div>' +
            '<h3 class="sdk-section-title">Third-Party Services Breakdown</h3>' +
            '<p class="sdk-section-desc">Expand any service to see why it is included and view its official policy.</p>' +
            '<div class="sdk-list">' + sdkHtml + '</div>' +
            '<div class="files-bar">' +
                '<span class="files-bar-label">Files in <code>' + escapeHtml(entry.slug) + '/</code></span>' +
                '<div class="files-bar-links">' + filesLinksHtml + '</div>' +
            '</div>'
        );
    }

    function renderFullPolicy(entry) {
        var sdkLinks = (entry.sdks || []).map(function (sdkName) {
            var info = SDK_CATALOG[sdkName];
            var url = info ? info.url : '#';
            return '<li><a href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(sdkName) + '</a></li>';
        }).join('');

        return (
            '<article class="policy-prose">' +
                '<h2>Overview</h2>' +
                '<p>Herghys Studio built the <strong>' + escapeHtml(entry.appName) + '</strong> app as a Free app. This Service is provided by Herghys Studio at no cost and is intended for use as is. By using this Service, you agree to the collection and use of information in relation to this policy.</p>' +
                '<h2>Information Collection and Use</h2>' +
                '<p>Information requested by the app is retained on your device and is not collected by Herghys Studio directly. However, the app uses third-party services that may collect information used to identify you:</p>' +
                '<ul>' + sdkLinks + '</ul>' +
                '<h2>Log Data &amp; Cookies</h2>' +
                '<p>In the event of an error in the app, third-party services may collect diagnostic Log Data (such as IP address, device name, OS version, and timestamp). While the app does not use cookies explicitly, third-party libraries may use cookies to improve their services.</p>' +
                '<h2>Security &amp; Children’s Privacy</h2>' +
                '<p>We strive to use commercially acceptable means of protecting your information, though no method of electronic transmission or storage is 100% secure. This Service does not address anyone under the age of 13, and we do not knowingly collect personal information from children under 13.</p>' +
                '<h2>Changes &amp; Contact</h2>' +
                '<p>This policy is effective as of <strong>' + escapeHtml(entry.effectiveDate) + '</strong>. Updates will be posted on this page. For questions, contact <a href="mailto:helmi.santosa1@gmail.com">helmi.santosa1@gmail.com</a>.</p>' +
            '</article>'
        );
    }

    function renderMarkdown(entry) {
        var slug = entry.slug;
        if (state.markdownCache[slug]) {
            readerBody.innerHTML = '<pre class="markdown-view">' + escapeHtml(state.markdownCache[slug]) + '</pre>';
            return;
        }

        if (window.location.protocol !== 'http:' && window.location.protocol !== 'https:') {
            readerBody.innerHTML =
                '<p class="sdk-section-desc">Markdown preview requires HTTP/HTTPS hosting. Open the file directly instead:</p>' +
                '<a class="btn-ui sm" href="' + encodeURIComponent(slug) + '/PrivacyPolicy.md">Open PrivacyPolicy.md</a>';
            return;
        }

        readerBody.innerHTML = '<p class="sdk-section-desc">Loading PrivacyPolicy.md...</p>';

        fetch(encodeURIComponent(slug) + '/PrivacyPolicy.md')
            .then(function (res) {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.text();
            })
            .then(function (text) {
                state.markdownCache[slug] = text;
                if (state.selectedSlug === slug && state.activeTab === 'markdown') {
                    readerBody.innerHTML = '<pre class="markdown-view">' + escapeHtml(text) + '</pre>';
                }
            })
            .catch(function () {
                if (state.selectedSlug === slug && state.activeTab === 'markdown') {
                    readerBody.innerHTML =
                        '<p class="sdk-section-desc">Could not load PrivacyPolicy.md inline.</p>' +
                        '<a class="btn-ui sm" href="' + encodeURIComponent(slug) + '/PrivacyPolicy.md">Open PrivacyPolicy.md</a>';
                }
            });
    }

    function renderReader() {
        var entry = getSelectedEntry();
        if (!entry) return;

        readerTitle.textContent = entry.appName;
        readerUpdated.textContent = 'Effective ' + entry.effectiveLabel;
        readerPath.textContent = '/PrivacyPolicyCollection/' + entry.slug + '/';
        openStandaloneBtn.href = encodeURIComponent(entry.slug) + '/';

        tabButtons.forEach(function (btn) {
            btn.setAttribute('aria-selected', btn.getAttribute('data-tab') === state.activeTab ? 'true' : 'false');
        });

        if (state.activeTab === 'overview') {
            readerBody.innerHTML = renderOverview(entry);
        } else if (state.activeTab === 'full') {
            readerBody.innerHTML = renderFullPolicy(entry);
        } else {
            renderMarkdown(entry);
        }
    }

    function selectApp(slug) {
        state.selectedSlug = slug;
        renderDirectory();
        renderReader();
    }

    // Auto-discover all policy folders from GitHub and parse their index.html directly in the browser
    function discoverPolicies() {
        if (window.location.protocol !== 'http:' && window.location.protocol !== 'https:') return;

        fetch(REPO_API, { headers: { Accept: 'application/vnd.github.v3+json' } })
            .then(function (res) { return res.ok ? res.json() : null; })
            .then(function (items) {
                if (!Array.isArray(items)) return;

                var folders = items.filter(function (item) {
                    return item.type === 'dir' &&
                        item.name.charAt(0) !== '.' &&
                        !IGNORED_DIRS[item.name];
                });

                if (!folders.length) return;

                var existingBySlug = {};
                state.entries.forEach(function (e) { existingBySlug[e.slug] = e; });

                Promise.all(folders.map(function (folder) {
                    return fetch(encodeURIComponent(folder.name) + '/index.html')
                        .then(function (r) { return r.ok ? r.text() : ''; })
                        .then(function (html) {
                            if (html) return parsePolicyHtml(folder.name, html);
                            return existingBySlug[folder.name] || parsePolicyHtml(folder.name, '');
                        })
                        .catch(function () {
                            return existingBySlug[folder.name] || parsePolicyHtml(folder.name, '');
                        });
                })).then(function (discovered) {
                    state.entries = discovered;
                    if (!discovered.some(function (e) { return e.slug === state.selectedSlug; })) {
                        state.selectedSlug = discovered[0].slug;
                    }
                    saveCachedEntries(discovered);
                    renderDirectory();
                    renderReader();
                });
            })
            .catch(function () {});
    }

    dirListEl.addEventListener('click', function (e) {
        var btn = e.target.closest('button[data-slug]');
        if (!btn) return;
        selectApp(btn.getAttribute('data-slug'));
    });

    readerBody.addEventListener('click', function (e) {
        var toggle = e.target.closest('.sdk-toggle');
        if (!toggle) return;
        var expanded = toggle.getAttribute('aria-expanded') === 'true';
        var panel = document.getElementById(toggle.getAttribute('aria-controls'));
        toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        if (panel) panel.hidden = expanded;
    });

    tabButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            state.activeTab = btn.getAttribute('data-tab');
            renderReader();
        });
    });

    filterInput.addEventListener('input', function (e) {
        state.filter = e.target.value;
        renderDirectory();
    });

    sortBtn.addEventListener('click', function () {
        state.sortAsc = !state.sortAsc;
        renderDirectory();
    });

    copyUrlBtn.addEventListener('click', function () {
        var entry = getSelectedEntry();
        if (!entry) return;
        var url = getPolicyAbsoluteUrl(entry);

        function markCopied() {
            copyUrlBtn.textContent = 'Copied Link';
            copyUrlBtn.classList.add('copied');
            setTimeout(function () {
                copyUrlBtn.textContent = 'Copy Policy URL';
                copyUrlBtn.classList.remove('copied');
            }, 1800);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(markCopied).catch(function () {
                window.prompt('Copy policy URL:', url);
            });
        } else {
            window.prompt('Copy policy URL:', url);
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === '/' && document.activeElement !== filterInput) {
            e.preventDefault();
            filterInput.focus();
            return;
        }
        if (e.key === 'Escape' && document.activeElement === filterInput) {
            filterInput.value = '';
            state.filter = '';
            filterInput.blur();
            renderDirectory();
            return;
        }
        if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && document.activeElement !== filterInput) {
            var visible = getVisibleEntries();
            if (!visible.length) return;
            var idx = visible.findIndex(function (item) { return item.slug === state.selectedSlug; });
            var next = e.key === 'ArrowDown'
                ? (idx + 1) % visible.length
                : (idx - 1 + visible.length) % visible.length;
            e.preventDefault();
            selectApp(visible[next].slug);
        }
    });

    renderDirectory();
    renderReader();
    discoverPolicies();
})();
