(function () {
    var progressBar = document.getElementById('reading-progress');
    var copyBtn = document.getElementById('copy-link-btn');
    var printBtn = document.getElementById('print-btn');
    var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.toc-link'));
    var sections = tocLinks
        .map(function (link) { return document.querySelector(link.getAttribute('href')); })
        .filter(Boolean);

    function updateProgress() {
        if (!progressBar) return;
        var scrollable = document.documentElement.scrollHeight - window.innerHeight;
        var pct = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
        progressBar.style.width = pct + '%';
    }

    if ('IntersectionObserver' in window && sections.length) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var id = '#' + entry.target.id;
                tocLinks.forEach(function (link) {
                    link.classList.toggle('active', link.getAttribute('href') === id);
                });
            });
        }, { rootMargin: '-96px 0px -65% 0px' });

        sections.forEach(function (sec) { observer.observe(sec); });
    }

    document.addEventListener('click', function (e) {
        var toggle = e.target.closest('.sdk-toggle');
        if (!toggle) return;
        var expanded = toggle.getAttribute('aria-expanded') === 'true';
        var panel = document.getElementById(toggle.getAttribute('aria-controls'));
        toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        if (panel) panel.hidden = expanded;
    });

    if (copyBtn) {
        copyBtn.addEventListener('click', function () {
            var url = window.location.href.split('#')[0];
            function markCopied() {
                copyBtn.textContent = 'Copied';
                copyBtn.classList.add('copied');
                setTimeout(function () {
                    copyBtn.textContent = 'Copy Link';
                    copyBtn.classList.remove('copied');
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
    }

    if (printBtn) {
        printBtn.addEventListener('click', function () {
            window.print();
        });
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
})();
