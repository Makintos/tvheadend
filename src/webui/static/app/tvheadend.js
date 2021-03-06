tvheadend.dynamic = true;
tvheadend.accessupdate = null;
tvheadend.capabilities = null;
tvheadend.admin = false;
tvheadend.dialog = null;
tvheadend.uilevel = 'expert';
tvheadend.uilevel_nochange = false;
tvheadend.quicktips = true;
tvheadend.wizard = null;
tvheadend.docs_toc = null;
tvheadend.doc_history = [];
tvheadend.doc_win = null;
tvheadend.language = window.navigator.userLanguage || window.navigator.language;

// Use en-US if browser language detection fails.
if (!tvheadend.language || !/\S/.test(tvheadend.language)) {
    console.log('No browser language detected, using hard-coded en-US.');
    tvheadend.language = "en-US";
}

tvheadend.cookieProvider = new Ext.state.CookieProvider({
  // 7 days from now
  expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 7))
});

/* State Provider */
Ext.state.Manager.setProvider(tvheadend.cookieProvider);

tvheadend.regexEscape = function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

tvheadend.fromCSV = function(s) {
    var a = s.split(',');
    var r = [];
    for (var i in a) {
        var v = a[i];
        if (v[0] == '"' && v[v.length-1] == '"')
            r.push(v.substring(1, v.length - 1));
        else
            r.push(v);
    }
    return r;
}

// We have "major" and "minor" mappings since we want things like
// "Movie" to be preferred to minor elements such as "Comedy" so we
// always end up displaying "Movie-Comedy" rather than having "Movie"
// sometimes hidden in middle of other icons.
//
// Although we can insert the characters here, we use the hex
// values because editors don't always work well with these
// characters.
//
// The comments refer to the official unicode name
//
// These categories should _not_ be subject to internationalization
// since many non-English xmltv providers appear to supply English
// words for categories, presumably for compatibility with
// mapping to a genre.
var catmap_major = {
  "movie" : "&#x1f39e;",        // Film frames
  "news" : "&#x1f4f0;",         // Newspaper
  "series" : "&#x1f4fa;",       // Television
  "sports" : "&#x1f3c5;",       // Sports medal
};

var catmap_minor = {
  // These are taken from the frequent categories in SD and then
  // sorted by name. They display reasonably well on a modern
  // font.
  "action" : "&#x1f3f9;",          // Bow and Arrow
  "adults only" : "&#x1f51e;",     // No one under eighteen symbol
  "adventure" : "&#x1f3f9;",       // Bow and Arrow
  "animals" : "&#x1f43e;",         // Paw prints
  "animated" : "&#x270f;&#xFE0F;", // Pencil
  "art" : "&#x1f3a8;",             // Artist pallette
  "auction" : "&#x1f4b8",          // Money with wings
  "auto racing" : "&#x1f3ce;",     // Racing car
  "auto" : "&#x1f3ce;",            // Racing car
  "baseball" : "&#x26BE;",         // Baseball
  "basketball" : "&#1f3c0;",       // Basketball and hoop
  "boxing" : "&#x1f94a;",          // Boxing glove
  "bus./financial" : "&#x1f4c8;",  // Chart with upwards trend
  "children" : "&#x1f476;",        // Baby
  "comedy" : "&#x1f600;",          // Grinning face
  "computers" : "&#x1f4bb;",       // Personal computer
  "community" : "&#x1f46a;",       // Family
  "cooking" : "&#x1f52a;",         // Cooking knife
  "crime drama" : "&#x1f46e;",     // Police officer
  "dance" : "&#x1f483;",           // Dancer
  "educational" : "&#x1f393;",     // Graduation cap
  "fantasy" : "&#x1f984;",         // Unicorn face
  "fashion" : "&#x1f460;",         // High heeled shoe
  "figure skating" : "&#x26F8;",   // Ice skate
  "fishing" : "&#x1f3a3;",         // Fishing pole and fish
  "football" : "&#x1f3c8;",        // American Football (not soccer)
  "game show" : "&#x1f3b2;",       // Game die
  "gymnastics" : "&#x1f938",       // Person doing cartwheel
  "history" : "&#x1f3f0;",         // Castle
  "holiday" : "&#x1f6eb;",         // Airplane departure
  "horror" : "&#x1f480;",          // Skull
  "horse" : "&#x1f434;",           // Horse face
  "house/garden" : "&#x1f3e1;",    // House with garden
  "interview" : "&#x1f4ac;",       // Speech balloon
  "law" : "&#x1f46e;",             // Police officer
  "martial arts" : "&#x1f94b;",    // Martial arts uniform
  "medical" : "&#x1f691;",         // Ambulance
  "military" : "&#x1f396;",        // Military medal
  "miniseries" : "&#x1f517;",      // Link symbol
  "motorcycle" : "&#x1f3cd;",      // Racing motorcycle
  "music" : "&#x1f3b5;",           // Musical note
  "musical" : "&#x1f3b5;",         // Musical note
  "mystery" : "&#x1f50d",          // Left pointing magnifying glass
  "nature" : "&#x1f418;",          // Elephant
  "paranormal" : "&#x1f47b;",      // Ghost
  "poker" : "&#x1f0b1;",           // Playing card ace of hearts
  "politics" : "&#x1f5f3;",        // Ballot box with ballot
  "pro wrestling" : "&#x1f93c;",   // Wrestlers
  "reality" : "&#x1f4f8;",         // Camera with flash
  "religious" : "&#x1f6d0;",       // Place of worship
  "romance" : "&#x2764;&#xfe0f;",  // Red Heart
  "romantic comedy" : "&#x2764;&#xfe0f;", // Red Heart
  "science fiction" : "&#x1f47d;", // Extraterrestrial alien
  "science" : "&#x1f52c;",         // Microscope
  "shopping" : "&#x1f6cd;",        // Shopping bags
  "sitcom": "&#x1f600;",           // Grinning face
  "skiing" : "&#x26f7;",           // Skier
  "soap" : "&#x1f754;",            // Alchemical symbol for soap
  "soccer" : "&#x26BD;",           // Soccer ball
  "sports talk" : "&#x1f4ac;",     // Speech balloon
  "spy": "&#x1f575;",              // Spy
  "standup" : "&#x1f3a4;",         // Microphone
  "swimming" : "&#x1f3ca;",        // Swimmer
  "talk" : "&#x1f4ac;",            // Speech balloon
  "technology" : "&#x1f4bb;",      // Personal computer
  "tennis" : "&#x1f3be;",          // Tennis racquet and ball
  "theater" : "&#1f3ad;",          // Performing arts
  "travel" : "&#x1f6eb;",          // Airplane departure
  "war" : "&#x1f396;",             // Military medal
  "weather" : "&#x26c5;",          // Sun behind cloud
  "weightlifting" : "&#x1f3cb;",   // Person lifting weights
  "western" : "&#x1f335;",         // Cactus
};

//  These are mappings for OTA genres
var genre_major = {
  // And genre major-numbers in hex
  "10" : "&#x1f4fa;",           // Television: can't distinguish movie / tv
  "20" : "&#x1f4f0;",           // Newspaper
  "30" : "&#x1f3b2;",           // Game die
  "40" : "&#x1f3c5;",           // Sports medal
  "50" : "&#x1f476;",           // Baby
  "60" : "&#x1f3b5;",           // Musical note
  "70" : "&#x1f3ad;",           // Performing arts
  "80" : "&#x1f5f3;",           // Ballot box with ballot
  "90" : "&#x1f393;",           // Graduation cap
  "a0" : "&#x26fa;",            // Tent
};

var genre_minor = {
  "11" : "&#x1f575;",           // Spy
  "12" : "&#x1f3f9;",           // Bow and Arrow
  "13" : "&#x1f47d;",           // Extraterrestrial alien
  "14" : "&#x1f600;",           // Grinning face
  "15" : "&#x1f754;",           // Alchemical symbol for soap
  "16" : "&#x2764;&#xfe0f;",    // Red Heart
  "18" : "&#x1f51e;",           // No one under eighteen symbol
  "33" : "&#x1f4ac;",           // Speech balloon
  "43" : "&#x26bd;",            // Soccer ball
  "44" : "&#x1f3be;",           // Tennis racquet and ball
  "73" : "&#x1f6d0;",           // Place of worship
  "91" : "&#x1f418;",           // Elephant
  "a1" : "&#x1f6eb;",           // Airplane departure
  "a5" : "&#x1f52a;",           // Cooking knife
  "a6" : "&#x1f6d2;",           // Shopping trolley
  "a7" : "&#x1f3e1;",           // House with garden
};

tvheadend.uniqueArray = function(arr) {
  var unique = [];
  for ( var i = 0 ; i < arr.length ; ++i ) {
    if ( unique.indexOf(arr[i]) == -1 )
      unique.push(arr[i]);
  }
  return unique;
}


tvheadend.getContentTypeIcons = function(rec) {
  var ret_major = [];
  var ret_minor = [];
  var cat = rec.category
  if (cat && cat.length) {
    cat.sort();
    for ( var i = 0 ; i < cat.length ; ++i ) {
      var v = cat[i];
      v = v.toLowerCase();
      var l = catmap_major[v];
      if (l) ret_major.push(l);
      l = catmap_minor[v];
      if (l) ret_minor.push(l)
    }
  } else {
    // Genre code
    var gen = rec.genre;
    if (gen) {
      for (var i = 0; i < gen.length; ++i) {
        var genre = parseInt(gen[i]);
        if (genre) {
          // Convert number to hex to make lookup easier to
          // cross-reference with epg.c
          var l = genre_major[(genre & 0xf0).toString(16)];
          if (l) ret_major.push(l);
          l = genre_minor[genre.toString(16)];
          if (l) ret_minor.push(l)
        }
      }
    }
  }

  var ret = "";
  if (rec.new)
    ret += "&#x1f195;";         // Squared New
  return ret + tvheadend.uniqueArray(ret_major).join("") + tvheadend.uniqueArray(ret_minor).join("");
}

tvheadend.displayCategoryIcon = function(value, meta, record, ri, ci, store) {
  if (value == null)
    return '';
  var icons = tvheadend.getContentTypeIcons(record.data);
  if (icons.length < 1) return '';
  return icons;
}

tvheadend.contentTypeAction = {
  width: 75,
  id: 'category',
  header: _("Content Type"),
  tooltip: _("Content Type"),
  dataIndex: 'category',
  renderer: tvheadend.displayCategoryIcon,
};

tvheadend.getDisplayTitle = function(title, record) {
  if (!title) return title;
  var year = record.data['copyright_year'];
  if (year)
    title += " (" + year + ")";
  return title;
}

// Helper function for common code to sort an array, convert to CSV and
// return the string to add to the content.
tvheadend.sortAndAddArray = function (arr, title) {
  arr.sort();
  var csv = arr.join(", ");
  if (csv)
    return '<div class="x-epg-meta"><span class="x-epg-prefix">' + title + ':</span><span class="x-epg-desc">' + csv + '</span></div>';
  else
    return '';
}

tvheadend.getDisplayCredits = function(credits) {
  if (!credits)
    return "";
  if (credits instanceof Array)
    return "";

  var content = "";
  // Our cast (credits) map contains details of actors, writers,
  // etc. so split in to separate categories for displaying.
  var castArr = [];
  var crewArr = [];
  var directorArr = [];
  var writerArr = [];
  var cast = ["actor", "guest", "presenter"];
  // We use arrays here in case more tags in the future map on to
  // director/writer, e.g., SchedulesDirect breaks it down in to
  // writer, writer (adaptation) writer (screenplay), etc. but
  // currently we just have them all as writer.
  var director = ["director"];
  var writer = ["writer"];

  for (var key in credits) {
    var type = credits[key];
    if (cast.indexOf(type) != -1)
      castArr.push(key);
    else if (director.indexOf(type) != -1)
      directorArr.push(key);
    else if (writer.indexOf(type) != -1)
      writerArr.push(key);
    else
      crewArr.push(key);
  };

  content += tvheadend.sortAndAddArray(castArr, _('Starring'));
  content += tvheadend.sortAndAddArray(directorArr, _('Director'));
  content += tvheadend.sortAndAddArray(writerArr, _('Writer'));
  content += tvheadend.sortAndAddArray(crewArr, _('Crew'));
  return content;
}

/**
 * Change uilevel
 */
tvheadend.uilevel_match = function(target, current) {
    if (current !== 'expert') {
        if (current === 'advanced' && target === 'expert')
            return false;
        else if (current === 'basic' && target !== 'basic')
            return false;
    }
    return true;
}

/*
 * Select specific tab
 */
tvheadend.select_tab = function(id)
{
    var i = Ext.getCmp(id);
    var c = i ? i.ownerCt : null;
    while (c) {
        if ('activeTab' in c) {
            c.setActiveTab(i);
        }
        i = c;
        c = c.ownerCt;
    }
}

/**
 * Displays a help popup window
 */
tvheadend.mdhelp = function(pagename) {

    var parse = function(text) {
        var renderer = new marked.Renderer;
        renderer.link = function(href, title, text) {
            var x = href.indexOf('#');
            if (href.indexOf(':/') === -1 && (x === -1 || x > 1)) {
                var r = '<a page="' + href + '"';
                if (title) r += ' title="' + title + '"';
                return r + '>' + text + '</a>';
            }
            return marked.Renderer.prototype.link.call(this, href, title, text);
        };
        renderer.image = function(href, title, text) {
            if (href) {
                if (href.substring(0, 7) == 'images/')
                    href = 'static/img' + href.substring(6);
                else if (href.substring(0, 6) == 'icons/')
                    href = 'static/' + href;
            }
            return marked.Renderer.prototype.image.call(this, href, title, text);
        };
        renderer.heading = function(text, level, raw) {
            var id = raw.toLowerCase().replace(/[^\w]+/g, '-');
            return '<h' + level + ' id="' + this.options.headerPrefix + id +
                   '"><a class="hts-doc-anchor" href="#' + id + '">' + text +
                   '</a></h' + level + '>\n';
        };
        opts = { renderer: renderer, headerPrefix: 'tvh-doc-hdr-' };
        return marked(text, opts);
    }

    var fcn = function(result) {
        var mdtext = result.responseText;
        var title = mdtext.split('\n')[0].split('#');
        var history = '';

        if (tvheadend.doc_win) {
            tvheadend.doc_win.close();
            tvheadend.doc_win = null;
        }

        if (title)
            title = title[title.length-1];

        if (tvheadend.doc_history) {
            for (var i = 1; i <= tvheadend.doc_history.length; i++) {
                var p = tvheadend.doc_history[i-1];
                if (!history)
                    history = '## ' + _('Last Help Pages') + '\n\n';
                history += '' + i + '. [' + p[1] + '](' + p[0] + ')\n';
            }
            history = parse(history);
            if (history)
                history += '<hr/>';
        }

        var bodyid = Ext.id();
        var text = '<div id="' + bodyid + '">';
        if (tvheadend.docs_toc || history)
            text += '<div class="hts-doc-toc">' + history + tvheadend.docs_toc + '</div>';
        text += '<div class="hts-doc-text">' + parse(mdtext) + '</div>';
        text += '</div>';

        var content = new Ext.Panel({
            autoScroll: true,
            border: false,
            layout: 'fit',
            html: text
        });

        var doresize = function(win) {
            var aw = Ext.lib.Dom.getViewWidth();
            var ah = Ext.lib.Dom.getViewHeight();
            var size = win.getSize();
            var osize = [size.width, size.height];
            var pos = win.getPosition();
            var opos = pos;

            if (pos[0] > -9000) {
                if (pos[0] + size.width > aw)
                    pos[0] = Math.max(0, aw - size.width);
                if (pos[0] + size.width > aw)
                    size.width = aw;
                if (pos[1] + size.height > ah)
                    pos[1] = Math.max(0, ah - size.height);
                if (pos[1] + size.height > ah)
                    size.height = ah;
                if (pos != opos || osize[0] != size.width || osize[1] != size.height) {
                  win.setPosition(pos);
                  win.setSize(size);
                }
            }

            var dom = win.getEl().dom;
            var el = dom.querySelectorAll("img");
            var maxwidth = '97%';
            if (size.width >= 350)
                maxwidth = '' + (size.width - 290) + 'px';
            for (var i = 0; i < el.length; i++)
                el[i].style['max-width'] = maxwidth;
        }

        var win = new Ext.Window({
            title: _('Help for') + ' ' + title,
            iconCls: 'help',
            layout: 'fit',
            width: 900,
            height: 400,
            constrainHeader: true,
            items: [content],
            listeners: {
                render: function(win) {
                    win.body.on('click', function(e, dom) {
                        var page = dom.getAttribute('page');
                        if (page) {
                            tvheadend.mdhelp(page);
                            return;
                        }
                        var href = dom.getAttribute('href');
                        if (href.indexOf('#') !== -1) {
                            var id = 'tvh-doc-hdr-' + href.substring(1);
                            var el = document.getElementById(id);
                            el.scrollIntoView();
                            return;
                        }
                    });
                },
                afterrender: function(win) {
                    doresize(win);
                },
                resize: function(win, width, height) {
                    doresize(win);
                },
                destroy: function(win) {
                    if (win == tvheadend.doc_win)
                        tvheadend.doc_win = null;
                    Ext.EventManager.removeResizeListener(doresize, this);
                }
            },
        });
        var aw = Ext.lib.Dom.getViewWidth();
        var ah = Ext.lib.Dom.getViewHeight();
        if (aw > 400) aw -= 50;
        if (aw > 500) aw -= 50;
        if (aw > 800) aw -= 100;
        if (ah > 400) ah -= 50;
        if (ah > 500) ah -= 50;
        if (ah > 800) ah -= 100;
        win.setSize(aw, ah);
        Ext.EventManager.onWindowResize(function() { doresize(this); }, win, [true]);
        win.show();
        tvheadend.doc_history = [[pagename, title]].concat(tvheadend.doc_history);
        if (tvheadend.doc_history.length > 5)
           tvheadend.doc_history.pop();
        tvheadend.doc_win = win;
    }

    var helpfailuremsg = function() {
        Ext.MessageBox.show({
            title:_('Error'),
            msg: _('There was a problem displaying the Help!') + '<br>' + 
                 _('Please check Tvheadend is running and try again.'), 
            buttons: Ext.Msg.OK,
            icon: Ext.MessageBox.ERROR,
        });
    }
    
    var helppagefail = function() { 
        title = _('Not Available');
        msg = _('There is no documentation associated with the Help button pressed, or there was an problem loading the page.\n\n') + 
              _('Please take a look at the other Help pages (Table of Contents). If you still can\'t find what you\'re ') + 
              _('looking for please see the [Wiki](http://tvheadend.org/projects/tvheadend/wiki) ') + 
              _('or join the [IRC channel on freenode](https://kiwiirc.com/client/chat.freenode.net/?nick=tvhhelp|?#hts).');
              
        // Fake the result.
        result = [];
        result['responseText'] = "## " + title + '\n\n' + msg;
        
        // Load the TOC.
        if (!tvheadend.docs_toc) {
            Ext.Ajax.request({
                url: 'markdown/toc',
                success: function(result_toc) {
                    tvheadend.docs_toc = parse(result_toc.responseText);
                    fcn(result);
                },
                failure: helpfailuremsg,
            });
        }
        fcn(result);
    }

    Ext.Ajax.request({
        url: 'markdown/' + pagename,
        success: function(result) {
            if (!tvheadend.docs_toc) {
                Ext.Ajax.request({
                    url: 'markdown/toc',
                    success: function(result_toc) {
                        tvheadend.docs_toc = parse(result_toc.responseText);
                        fcn(result);
                    },
                    failure: helpfailuremsg,
                });
            } else {
                fcn(result);
            }
        },
        failure: helppagefail,
    });
};

tvheadend.paneladd = function(dst, add, idx) {
    if (idx != null)
        dst.insert(idx, add);
    else
        dst.add(add);
};

tvheadend.panelreg = function(tabpanel, panel, builder, destroyer) {
    /* the 'activate' event does not work in ExtJS 3.4 */
    tabpanel.on('beforetabchange', function(tp, p) {
        if (p == panel)
            builder();
    });
    panel.on('deactivate', destroyer);
}

tvheadend.Ajax = function(conf) {
    var orig_success = conf.success;
    var orig_failure = conf.failure;
    conf.success = function(d) {
        tvheadend.loading(0);
        if (orig_success)
            orig_success(d);
    }
    conf.failure = function(d) {
        tvheadend.loading(0);
        if (orig_failure)
            orig_failure(d);
    }
    tvheadend.loading(1);
    Ext.Ajax.request(conf);
};

tvheadend.AjaxConfirm = function(conf) {
    Ext.MessageBox.confirm(
        conf.title || _('Message'),
        conf.question || _('Do you really want to delete the selection?'),
        function (btn) {
            if (btn == 'yes')
                tvheadend.Ajax(conf);
        }
    );
};

tvheadend.AjaxUUID = function(sel, conf)
{
    if (sel && sel.length > 0) {
        var uuids = [];
        for (var i = 0; i < sel.length; i++)
            uuids.push(sel[i].id);
        if (!conf.params)
            conf.params = {};
        conf.params.uuid = Ext.encode(uuids);
        tvheadend.Ajax(conf);
    }    
}

tvheadend.loading = function(on) {
    if (on)
      Ext.getBody().mask(_('Loading, please wait...'), 'loading');
    else
      Ext.getBody().unmask();
};

tvheadend.PagingToolbarConf = function(conf, title, auto, count)
{
  conf.width = 50;
  conf.pageSize = 50;
  conf.displayInfo = true;
                    /// {0} start, {1} end, {2} total, {3} title
  conf.displayMsg = _('{3} {0} - {1} of {2}').replace('{3}', title);
                    /// {0} title (lowercase), {1} title
  conf.emptyMsg = String.format(_('No {0} to display'), title.toLowerCase(), title);
  conf.items = [];
  if (auto || count)
    conf.items.push('-');
  if (auto) {
    conf.items.push(_('Auto-refresh'));
    conf.items.push(auto);
  }
  if (count) {
    conf.items.push('->');
    conf.items.push('-');
    conf.items.push(_('Per page'));
    conf.items.push(count);
  }
  return conf;
}

/*
 * Any Match option in ComboBox queries
 * This query is identical as in extjs-all.js
 * except one
 */
tvheadend.doQueryAnyMatch = function(q, forceAll) {
    q = Ext.isEmpty(q) ? '' : q;
    var qe = {
        query: q,
        forceAll: forceAll,
        combo: this,
        cancel:false
    };

    if (this.fireEvent('beforequery', qe) === false || qe.cancel)
        return false;

    q = qe.query;
    forceAll = qe.forceAll;
    if (forceAll === true || (q.length >= this.minChars)) {
        if (this.lastQuery !== q) {
            this.lastQuery = q;
            if (this.mode == 'local') {
                this.selectedIndex = -1;
                if (forceAll) {
                    this.store.clearFilter();
                } else {
                    /* supply the anyMatch option (last param) */
                    this.store.filter(this.displayField, q, true);
                }
                this.onLoad();
            } else {
                this.store.baseParams[this.queryParam] = q;
                this.store.load({ params: this.getParams(q) });
                this.expand();
            }
        } else {
            this.selectedIndex = -1;
            this.onLoad();
        }
    }
}

/*
 * Replace one entry
 */

tvheadend.replace_entry = function(r, d) {
    if (!r) return;
    var dst = r.data;
    var src = d.params instanceof Array ? d.params : d;
    var lookup = src instanceof Array;
    r.store.fields.each(function (n) {
        if (lookup) {
            for (var i = 0; i < src.length; i++) {
                if (src[i].id == n.name) {
                    var v = src[i].value;
                    break;
                }
            }
        } else {
            var v = src[n.name];
        }
        var x = v;
        if (typeof v === 'undefined')
            x = typeof n.defaultValue === 'undefined' ? '' : n.defaultValue;
        dst[n.name] = n.convert(x, v);
    });
    r.json = src;
    r.commit();
}

/*
 * General capabilities
 */
Ext.Ajax.request({
    url: 'api/config/capabilities',
    success: function(d)
    {
        if (d && d.responseText)
            tvheadend.capabilities = Ext.util.JSON.decode(d.responseText);
        if (tvheadend.capabilities && tvheadend.accessupdate)
            accessUpdate(tvheadend.accessUpdate);

    }
});

/*
 *
 */
tvheadend.niceDate = function(dt) {
    var d = new Date(dt);
    return '<div class="x-nice-dayofweek">' + d.toLocaleString(tvheadend.language, {weekday: 'long'}) + '</div>' +
           '<div class="x-nice-date">' + d.toLocaleDateString() + '</div>' +
           '<div class="x-nice-time">' + d.toLocaleTimeString() + '</div>';
}

/* Date format when time is not needed, e.g., first_aired time is
 * often 00:00.  Also takes a reference date so if the dt can be made
 * nicer such as "Previous day" then we will use that instead.
 */
tvheadend.niceDateYearMonth = function(dt, refdate) {
    var d = new Date(dt);
    // If we have a reference date then we try and make the
    // date nicer.
    if  (refdate) {
      var rd = new Date(refdate);
      if (rd.getYear()  == d.getYear() &&
          rd.getMonth() == d.getMonth() &&
          rd.getDate()  == d.getDate()) {
          var when;
          if (rd.getHours()   == d.getHours() &&
              rd.getMinutes() == d.getMinutes()) {
              when = _("Premiere");
          } else {
              when = _("Same day");
          }
          return '<div class="x-nice-dayofweek">' + when + '</div>';
      } else {
        // Determine if it is previous day. We can't just subtract
        // timestamps since a programme on at 8pm could have
        // a previous shown timestamp of 00:00 on previous day,
        // so would be > 86400 seconds ago. So, create temporary
        // dates with timestamps of 00:00 and compare those.
        var d0 = new Date(d);
        var rd0 = new Date(rd);
        d0.setHours(0);
        d0.setMinutes(0);
        rd0.setHours(0);
        rd0.setMinutes(0);
        if (Math.abs(d0 - rd0) <= (24 * 60 * 60 * 1000)) {
          return '<div class="x-nice-dayofweek">' + _("Previous day") + '</div>';
        }
      }
    }
    return '<div class="x-nice-dayofweek">' + d.toLocaleString(tvheadend.language, {weekday: 'long'}) + '</div>' +
           '<div class="x-nice-date">' + d.toLocaleDateString() + '</div>';
}

/*
 *
 */
tvheadend.playLink = function(link, title) {
    if (title) title = '?title=' + encodeURIComponent(title);
    return '<a href="' + link + title + '">' +
           '<img src="static/icons/control_play.png" class="playlink" title="' +
           _('Play this stream') + '" alt="' + _('Play') + '"/></a>';
}

/**
 * Displays a mediaplayer using the html5 video element
 */
tvheadend.VideoPlayer = function(channelId) {

    var videoPlayer = new tv.ui.VideoPlayer({
        params: { }
    });
    
    var initialChannelName;
    if (channelId) {
        var record = tvheadend.channels.getById(channelId);
        initialChannelName = record.data.val;
    }

    var selectChannel = new Ext.form.ComboBox({
        loadingText: _('Loading...'),
        width: 200,
        displayField: 'val',
        store: tvheadend.channels,
        mode: 'local',
        editable: true,
        triggerAction: 'all',
        emptyText: _('Select channel...'),
        value: initialChannelName
    });

    selectChannel.on('select', function(c, r) {
        videoPlayer.zapTo(r.id);
    });

    var slider = new Ext.Slider({
        width: 135,
        height: 20,
        value: 90,
        increment: 1,
        minValue: 0,
        maxValue: 100
    });

    var sliderLabel = new Ext.form.Label();
    sliderLabel.setText('90%');
    slider.addListener('change', function() {
        videoPlayer.setVolume(slider.getValue());
        sliderLabel.setText(videoPlayer.getVolume() + '%');
    });

    if (!tvheadend.profiles) {
        tvheadend.profiles = tvheadend.idnode_get_enum({
            url: 'api/profile/list',
            event: 'profile'
        });
    }

    var selectProfile = new Ext.form.ComboBox({
        loadingText: _('Loading...'),
        width: 150,
        displayField: 'val',
        mode: 'local',
        editable: false,
        triggerAction: 'all',
        emptyText: _('Select stream profile...'),
        store: tvheadend.profiles
    });

    selectProfile.on('select', function(c, r) {
        videoPlayer.setProfile(r.data.val);
        if (videoPlayer.isIdle())
            return;

        var index = selectChannel.selectedIndex;
        if (index < 0)
            return;

        var ch = selectChannel.getStore().getAt(index);
        videoPlayer.zapTo(ch.id);
    });

    var win = new Ext.Window({
        title: _('Live TV Player'),
        layout: 'fit',
        width: 682 + 14,
        height: 384 + 56,
        constrainHeader: true,
        iconCls: 'watchTv',
        resizable: true,
        tbar: [
            selectChannel,
            '-',
            {
                iconCls: 'control_play',
                tooltip: _('Play'),
                handler: function() {
                    if (!videoPlayer.isIdle()) { //probobly paused
                        videoPlayer.play();
                        return;
                    }

                    var index = selectChannel.selectedIndex;
                    if (index < 0)
                        return;

                    var ch = selectChannel.getStore().getAt(index);
                    videoPlayer.zapTo(ch.id);
                }
            },
            {
                iconCls: 'control_pause',
                tooltip: _('Pause'),
                handler: function() {
                    videoPlayer.pause();
                }
            },
            {
                iconCls: 'control_stop',
                tooltip: _('Stop'),
                handler: function() {
                    videoPlayer.stop();
                }
            },
            '-',
            {
                iconCls: 'control_fullscreen',
                tooltip: _('Fullscreen'),
                handler: function() {
                    videoPlayer.fullscreen();
                }
            },
            '-',
            selectProfile,
            '-',
            {
                iconCls: 'control_mute',
                tooltip: _('Toggle mute'),
                handler: function() {
                    var muted = videoPlayer.muteToggle();
                    slider.setDisabled(muted);
                    sliderLabel.setDisabled(muted);
                }
            },
            {
                iconCls: 'control_volume',
                tooltip: _('Volume'),
                disabled: true
            }],
        items: [videoPlayer]
    });

    win.on('beforeShow', function() {
        win.getTopToolbar().add(slider);
        win.getTopToolbar().add(new Ext.Toolbar.Spacer());
        win.getTopToolbar().add(new Ext.Toolbar.Spacer());
        win.getTopToolbar().add(new Ext.Toolbar.Spacer());
        win.getTopToolbar().add(sliderLabel);

        // Zap to initial channel when the player is ready
        if (channelId) {
            videoPlayer.zapTo(channelId);
        }
    });
    
    win.on('close', function() {
        videoPlayer.stop();
    });

    win.show();
};

function diskspaceUpdate(o) {
  if ('freediskspace' in o && 'useddiskspace' in o && 'totaldiskspace' in o)
    tvheadend.rootTabPanel.setDiskSpace(o.freediskspace, o.useddiskspace, o.totaldiskspace);
}

/**
 * This function creates top level tabs based on access so users without
 * access to subsystems won't see them.
 *
 * Obviosuly, access is verified in the server too.
 */
function accessUpdate(o) {
    tvheadend.accessUpdate = o;
    if (!tvheadend.capabilities)
        return;

    tvheadend.admin = o.admin == true;

    if (o.uilevel)
        tvheadend.uilevel = o.uilevel;

    if (o.theme)
        tvheadend.theme = o.theme;

    tvheadend.quicktips = o.quicktips ? true : false;

    if (o.uilevel_nochange)
        tvheadend.uilevel_nochange = true;

    if ('info_area' in o)
        tvheadend.rootTabPanel.setInfoArea(o.info_area);
    if ('username' in o)
        tvheadend.rootTabPanel.setLogin(o.username);
    if ('address' in o)
        tvheadend.rootTabPanel.setAddress(o.address);
    if ('freediskspace' in o && 'useddiskspace' in o && 'totaldiskspace' in o)
        tvheadend.rootTabPanel.setDiskSpace(o.freediskspace, o.useddiskspace, o.totaldiskspace);

    if ('cookie_expires' in o && o.cookie_expires > 0)
        tvheadend.cookieProvider.expires =
            new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * o.cookie_expires));

    if (tvheadend.autorecButton)
        tvheadend.autorecButton.setDisabled(o.dvr != true);

    if (o.dvr == true && tvheadend.dvrpanel == null) {
        tvheadend.dvrpanel = tvheadend.dvr();
        tvheadend.rootTabPanel.add(tvheadend.dvrpanel);
    }

    if (o.admin == true && tvheadend.confpanel == null) {

        var cp = new Ext.TabPanel({
            activeTab: 0,
            autoScroll: true,
            title: _('Configuration'),
            iconCls: 'wrench',
            items: []
        });

        /* General */
        var general = new Ext.TabPanel({
            tabIndex: 0,
            activeTab: 0,
            autoScroll: true,
            title: _('General'),
            iconCls: 'general',
            items: []
        });

        tvheadend.baseconf(general);
        tvheadend.imgcacheconf(general);
        tvheadend.satipsrvconf(general);

        cp.add(general);

        /* Users */
        var users = new Ext.TabPanel({
            tabIndex: 1,
            activeTab: 0,
            autoScroll: true,
            title: _('Users'),
            iconCls: 'group',
            items: []
        });

        tvheadend.acleditor(users);
        tvheadend.passwdeditor(users);
        tvheadend.ipblockeditor(users);

        cp.add(users);

        /* DVB inputs, networks, muxes, services */
        var dvbin = new Ext.TabPanel({
            tabIndex: 2,
            activeTab: 0,
            autoScroll: true,
            title: _('DVB Inputs'),
            iconCls: 'hardware',
            items: []
        });

        if (tvheadend.capabilities.indexOf('tvadapters') !== -1)
            tvheadend.tvadapters(dvbin);
        tvheadend.networks(dvbin);
        tvheadend.muxes(dvbin);
        tvheadend.services(dvbin);
        tvheadend.mux_sched(dvbin);

        cp.add(dvbin);

        /* Channel / EPG */
        var chepg = new Ext.TabPanel({
            tabIndex: 3,
            activeTab: 0,
            autoScroll: true,
            title: _('Channel / EPG'),
            iconCls: 'television',
            items: []
        });
        tvheadend.channel_tab(chepg);
        tvheadend.cteditor(chepg);
        tvheadend.bouquet(chepg);
        tvheadend.epggrab_map(chepg);
        tvheadend.epggrab_base(chepg);
        tvheadend.epggrab_mod(chepg);

        cp.add(chepg);

        /* Stream Config */
        var stream = new Ext.TabPanel({
            tabIndex: 4,
            activeTab: 0,
            autoScroll: true,
            title: _('Stream'),
            iconCls: 'film_edit',
            items: []
        });
        tvheadend.profile_tab(stream);
        if (tvheadend.capabilities.indexOf('libav') !== -1)
            tvheadend.codec_tab(stream);
        tvheadend.esfilter_tab(stream);

        cp.add(stream);

        /* DVR / Timeshift */
        var tsdvr = new Ext.TabPanel({
            tabIndex: 5,
            activeTab: 0,
            autoScroll: true,
            title: _('Recording'),
            iconCls: 'recordingtab',
            items: []
        });
        tvheadend.dvr_settings(tsdvr);
        if (tvheadend.capabilities.indexOf('timeshift') !== -1)
            tvheadend.timeshift(tsdvr);

        cp.add(tsdvr);

        /* CSA */
        if (tvheadend.capabilities.indexOf('caclient') !== -1)
            tvheadend.caclient(cp, 6);

        /* Debug */
        if (o.uilevel == 'advanced' || o.uilevel == 'expert') {
            var dbg = new Ext.TabPanel({
                tabIndex: 7,
                activeTab: 0,
                autoScroll: true,
                title: _('Debugging'),
                iconCls: 'debug',
                items: []
            });
            tvheadend.tvhlog(dbg, 0);
            tvheadend.memoryinfo(dbg, 1);

            cp.add(dbg);
        }

        /* Finish */
        tvheadend.rootTabPanel.add(cp);
        tvheadend.confpanel = cp;
        cp.doLayout();
    }

    if (o.admin == true && tvheadend.statuspanel == null) {
        tvheadend.statuspanel = new tvheadend.status;
        tvheadend.rootTabPanel.add(tvheadend.statuspanel);
    }

    if (tvheadend.aboutPanel == null) {
        tvheadend.aboutPanel = new Ext.Panel({
            border: false,
            layout: 'fit',
            autoScroll: true,
            title: _('About'),
            iconCls: 'info',
            autoLoad: 'about.html'
        });
        tvheadend.rootTabPanel.add(tvheadend.aboutPanel);
    }

    tvheadend.rootTabPanel.doLayout();

    if (o.wizard)
        tvheadend.wizard_start(o.wizard);
}

/**
 *
 */
function setServerIpPort(o) {
    tvheadend.serverIp = o.ip;
    tvheadend.serverPort = o.port;
}

function makeRTSPprefix() {
    return 'rtsp://' + tvheadend.serverIp + ':' + tvheadend.serverPort + '/';
}

/**
 *
 */
tvheadend.log = function(msg, style) {
    s = style ? '<div style="' + style + '">' : '<div>';

    sl = Ext.get('systemlog');
    e = Ext.DomHelper.append(sl, s + '<pre>' + msg + '</pre></div>');
    e.scrollIntoView('systemlog');
};

/**
 *
 */
tvheadend.RootTabExtraComponent = Ext.extend(Ext.Component, {

    onRender1: function(tab, before) {
        if (!this.componentTpl) {
            var tt = new Ext.Template(
                '<li class="x-tab-extra-comp" id="{id}">',
                '<span class="x-tab-strip-extra-comp {iconCls} x-tab-strip-text">{text}</span></li>'
            );
            tt.disableFormats = true;
            tt.compile();
            tvheadend.RootTabExtraComponent.prototype.componentTpl = tt;
        }
        var p = tab.getTemplateArgs(this);
        var el = this.componentTpl.insertBefore(before, p);
        this.tabEl = Ext.get(el);
    }

});

tvheadend.RootTabExtraClickComponent = Ext.extend(Ext.Component, {

    onRender1: function(tab, before, click_cb) {
        if (!this.componentTpl) {
            var tt = new Ext.Template(
                '<li class="x-tab-extra-comp" id="{id}"><a href="#">',
                '<span class="x-tab-strip-extra-click-comp {iconCls} x-tab-strip-text">{text}</span></a></li>'
            );
            tt.disableFormats = true;
            tt.compile();
            tvheadend.RootTabExtraClickComponent.prototype.componentTpl = tt;
        }
        var p = tab.getTemplateArgs(this);
        var el = this.componentTpl.insertBefore(before, p);
        this.tabEl = Ext.get(el);
        this.tabEl.select('a').on('click', click_cb, tab, {preventDefault: true});
    }

});

tvheadend.RootTabPanel = Ext.extend(Ext.TabPanel, {

    extra: [],
    info_area: [],

    getComponent: function(comp) {
        for (var k in this.extra) {
            var comp2 = this.extra[k];
            if (comp === comp2.id || comp == comp2)
                return comp2;
        }
        return tvheadend.RootTabPanel.superclass.getComponent.call(this, comp);
    },

    setInfoArea: function(info_area) {
        this.info_area = tvheadend.fromCSV(info_area);
        this.on('beforetabchange', function(tp, p) {
            for (var k in this.extra)
                if (p == this.extra[k])
                    return false;
        });

        var before = this.strip.dom.childNodes[this.strip.dom.childNodes.length-1];

        /* Create extra components */
        for (var itm in this.info_area) {
            var nm = this.info_area[itm];
            if (!(nm in this.extra)) {
                this.extra[nm] = new tvheadend.RootTabExtraComponent();
                this.extra[nm].onRender1(this, before);
                if (nm == 'login') {
                    this.extra.loginCmd = new tvheadend.RootTabExtraClickComponent();
                    this.extra.loginCmd.onRender1(this, before, this.onLoginCmdClicked);
                }
            }
        }

        if (this.extra.time)
            window.setInterval(this.setTime, 1000);
    },

    setLogin: function(login) {
        if (!('login' in this.extra)) return;
        this.login = login;
        if (login) {
            text = _('Logged in as') + ' <b>' + login + '</b>';
            cmd = '(' + _('logout') + ')';
        } else {
            text = _('No verified access');
            cmd = '(' + _('login') + ')';
        }
        Ext.get(this.extra.login.tabEl).child('span.x-tab-strip-extra-comp', true).innerHTML = text;
        Ext.get(this.extra.loginCmd.tabEl).child('span.x-tab-strip-extra-click-comp', true).innerHTML = cmd;
    },

    setAddress: function(addr) {
        if ('login' in this.extra)
            Ext.get(this.extra.login.tabEl).child('span.x-tab-strip-extra-comp', true).qtip = addr;
    },

    setDiskSpace: function(bfree, bused, btotal) {
        if (!('storage' in this.extra)) return;
        human = function(val) {
          if (val > 1073741824)
            val = parseInt(val / 1073741824) + _('GiB');
          if (val > 1048576)
            val = parseInt(val / 1048576) + _('MiB');
          if (val > 1024)
            val = parseInt(val / 1024) + _('KiB');
          return val;
        };
        text = _('Storage space') + ':&nbsp;<b>' + human(bfree) + '/' + human(bused) + '/' + human(btotal) + '</b>';
        var el = Ext.get(this.extra.storage.tabEl).child('span.x-tab-strip-extra-comp', true);
        el.innerHTML = text;
        el.qtip = _('Free') + ': ' + human(bfree) + ' ' + _('Used by tvheadend') + ': ' + human(bused) + ' ' + _('Total') + ': ' + human(btotal);
    },

    setTime: function(stime) {
        var panel = tvheadend.rootTabPanel;
        if (!('time' in panel.extra)) return;
        var d = stime ? new Date(stime) : new Date();
        var el = Ext.get(panel.extra.time.tabEl).child('span.x-tab-strip-extra-comp', true);
        el.innerHTML = '<b>' + d.toLocaleTimeString() + '</b>';
        el.qtip = d.toLocaleString();
    },

    onLoginCmdClicked: function(e) {
        if (this.login && (document.all || window.navigator.userAgent.indexOf("Edge") > -1 ||
                           (!!window.MSInputMethodContext && !!document.documentMode))) {
            document.execCommand("ClearAuthenticationCache");
            window.location.href = '';
            return;
        }
        XMLHttpRequest.prototype.send = function(){};
        window.location.href = this.login ? 'logout' : 'login';
    }

});

/**
 *
 */
//create application
tvheadend.app = function() {

    // public space
    return {
        // public methods
        init: function() {
            var header = new Ext.Panel({
                split: true,
                region: 'north',
                height: 45,
                boxMaxHeight: 45,
                boxMinHeight: 45,
                border: false,
                hidden: true,
                html: '<div id="header"><h1>' + _('Tvheadend Web-Panel') + '</h1></div>'
            });

            tvheadend.rootTabPanel = new tvheadend.RootTabPanel({
                region: 'center',
                activeTab: 0,
                items: [tvheadend.epg()]
            });

            var viewport = new Ext.Viewport({
                layout: 'border',
                items: [{
                        region: 'south',
                        contentEl: 'systemlog',
                        split: true,
                        autoScroll: true,
                        height: 150,
                        minSize: 100,
                        maxSize: 400,
                        collapsible: true,
                        collapsed: true,
                        title: _('Tvheadend log'),
                        margins: '0 0 0 0',
                        tools: [{
                                id: 'gear',
                                qtip: _('Enable debug output'),
                                handler: function(event, toolEl, panel) {
                                    Ext.Ajax.request({
                                        url: 'comet/debug',
                                        params: {
                                            boxid: tvheadend.boxid
                                        }
                                    });
                                }
                            }]
                    }, tvheadend.rootTabPanel, header]
            });

            tvheadend.comet.on('accessUpdate', accessUpdate);

            tvheadend.comet.on('diskspaceUpdate', diskspaceUpdate);

            tvheadend.comet.on('setServerIpPort', setServerIpPort);

            tvheadend.comet.on('logmessage', function(m) {
                tvheadend.log(m.logtxt);
            });

            tvheadend.cometInit();

            Ext.QuickTips.init();
        }

    };
}(); // end of app
