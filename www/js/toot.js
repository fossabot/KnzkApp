function toot_card(toot, mode, note, toot_light, page) {
  var piccard = '',
    namucard = '',
    p = 0,
    alert_text = '',
    content = '';
  var visibility_icon,
    can_col,
    is_col = '',
    col_bt = '',
    col_pic = '',
    col_bg_st = '';
  var BoxData = {};
  if (!toot) {
    return '';
  }
  if (toot['reblog']) {
    if (!toot['account']['display_name'])
      toot['account']['display_name'] = toot['account']['username'];
    alert_text =
      "<p class='alert_text'><ons-icon icon=\"fa-retweet\" class='boost-active'></ons-icon> <b onclick='show_account(" +
      toot['account']['id'] +
      ")'>" +
      i18next.t('toot.boost.prefix') +
      escapeHTML(toot['account']['display_name']) +
      '</b>' +
      i18next.t('toot.boost.suffix') +
      " (<span data-time='" +
      toot['created_at'] +
      "' class='date'>" +
      displayTime('new', toot['created_at']) +
      '</span>)</p>';
    toot = toot['reblog'];
  }
  tl_postdata[toot['id']] = toot;
  var filter = getConfig(
    5,
    (toot['account']['acct'].indexOf('@') === -1
      ? toot['account']['acct'] + '@' + inst
      : toot['account']['acct']
    ).toLowerCase()
  );
  if (filter['all'] || filter['toot']) {
    return '';
  }

  if (!toot['account']['display_name'])
    toot['account']['display_name'] = toot['account']['username'];

  if (toot['enquete']) {
    var vote = '';
    toot['enquete'] = JSON.parse(toot['enquete']);
    if (toot['enquete']['ratios_text']) {
      vote = 'closed_result';
    } else {
      //受付中
      if (!toot['enquete']['duration']) toot['enquete']['duration'] = 30;

      var enq_comp_date = new Date(
        Math.floor(new Date().getTime() / 1000) -
          Math.floor(new Date(toot['created_at']).getTime() / 1000)
      );
      var enq_sec_comp = toot['enquete']['duration'] - enq_comp_date;

      vote = enq_sec_comp >= 0 ? 'open' : 'closed';
      BoxData['vote'] = vote;
    }
  }

  if (getConfig(1, 'bigfav') == 1 && mode != 'big') {
    namucard = ' namu-toot';
    namubt = ' namu-fav';
  }

  if (toot_light === 'gold') BoxData['toot_base_classes'] += ' toot_gold';
  if (toot_light === 'light') BoxData['toot_base_classes'] += ' toot_light';

  if (getConfig(2, 'collapse') && mode != 'big') {
    if (getConfig(2, 'preview') && toot['media_attachments'][0] && !toot['sensitive']) {
      col_pic = toot['media_attachments'][0]['preview_url'];
    } else if (getConfig(2, 'bg')) {
      col_pic = toot['account']['header_static'];
    }
    if (
      getConfig(2, 'all') ||
      (getConfig(2, 'alert') && page === 'alert' && note) ||
      (getConfig(2, 'leng') && toot['content'].length > 300) ||
      (getConfig(2, 'bs') && toot['reblog']) ||
      (getConfig(2, 're') && toot['mentions'][0]) ||
      (getConfig(2, 'media') && toot['media_attachments'][0]) ||
      (getConfig(2, 'pinned') && page === 'acctpage_pinned')
    ) {
      can_col = true;
      is_col = ' toot-small';
      if (col_pic) {
        col_bg_st = 'background: url("' + col_pic + '");';
        BoxData['toot_base_classes'] += ' col_bg';
      }
    } else {
      can_col = true;
    }
  }

  if (can_col && is_col) {
    col_bt =
      "<button class='no-rd p0 button button--quiet' onclick='toot_col(\"" +
      toot['id'] +
      "\")' style='margin-left: 10px'><i class='fa fa-fw fa-angle-double-down toot-right-icon blue toot_col_" +
      toot['id'] +
      "'></i></button>";
    button_col = 'disable ';
  } else if (can_col) {
    col_bt =
      "<button class='no-rd p0 button button--quiet' onclick='toot_col(\"" +
      toot['id'] +
      "\")' style='margin-left: 10px'><i class='fa fa-fw fa-angle-double-up toot-right-icon toot_col_" +
      toot['id'] +
      "'></i></button>";
  }
  if (toot['visibility'] === 'direct') {
    visibility_icon = 'envelope';
    BoxData['toot_base_classes'] += ' toot_dm';
  } else if (toot['visibility'] === 'private') {
    visibility_icon = 'lock';
  } else {
    if (toot['visibility'] === 'unlisted') visibility_icon = 'unlock-alt';
    else if (toot['visibility'] === 'public') visibility_icon = 'globe';
  }

  try {
    if (toot['media_attachments'][0] && (mode == 'full' || mode == 'big')) {
      while (toot['media_attachments'][p]) {
        if (toot['sensitive'] && getConfig(1, 'nsfw') != 1) {
          //NSFWオン
          piccard +=
            "<a href='" +
            toot['media_attachments'][p]['url'] +
            "'><ons-card class='nsfw'><h3>" +
            i18next.t('toot.nsfw.title') +
            '</h3><small>' +
            i18next.t('toot.nsfw.sub') +
            '</small></ons-card></a>';
        } else {
          if (getConfig(1, 'image_full') == '1') {
            piccard +=
              "<a href='" +
              toot['media_attachments'][p]['url'] +
              "'><img src='" +
              toot['media_attachments'][p]['preview_url'] +
              "' class='image_fullsize'/></a>";
          } else {
            piccard +=
              "<a href='" +
              toot['media_attachments'][p]['url'] +
              "'><ons-card style='background-image: url(" +
              toot['media_attachments'][p]['preview_url'] +
              ")' class='card-image'></ons-card></a>";
          }
        }
        p++;
      }
    } else if (!toot['media_attachments'][0] && toot_light === 'media') {
      return '';
    }
  } catch (e) {
    console.log('error_image');
  }

  toot['content'] = toot['content'].replace(
    /<a href="((http:|https:)\/\/[\x21-\x26\x28-\x7e]+)\/media\/([\x21-\x26\x28-\x7e]+)" rel="nofollow noopener" target="_blank"><span class="invisible">(http:|https:)\/\/<\/span><span class="ellipsis">([\x21-\x26\x28-\x7e]+)\/media\/([\x21-\x26\x28-\x7e]+)<\/span><span class="invisible">([\x21-\x26\x28-\x7e]+)<\/span><\/a>/g,
    "<a href='$1/media/$3' class='image-url'><ons-icon icon='fa-file-image-o'></ons-icon></a>"
  ); //画像URLをアイコンに

  var rand = Math.random()
    .toString(36)
    .slice(-8);

  if (toot['spoiler_text'] && getConfig(1, 'cw') != 1) {
    content =
      escapeHTML(toot['spoiler_text']) +
      '　<ons-button modifier="large--quiet" onclick=\'open_cw("cw_' +
      rand +
      '_' +
      toot['id'] +
      "\", this);' class='cw-button'>" +
      i18next.t('navigation.load_more') +
      "</ons-button><div class='invisible' id='cw_" +
      rand +
      '_' +
      toot['id'] +
      "'><p>" +
      toot['content'] +
      piccard +
      '</p></div>';
  } else if (toot['spoiler_text']) {
    //CW / 常に表示
    content = escapeHTML(toot['spoiler_text']) + '<p>' + toot['content'] + piccard + '</p>';
  } else {
    //CWなし
    content = toot['content'] + piccard;
  }

  if (mode == 'big') {
    var appname = toot['application'] ? escapeHTML(toot['application']['name']) : '';
    var d = new Date(toot['created_at']);
    var date_text = d.toLocaleDateString(lng, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    BoxData['appname'] = appname;
    BoxData['date_text'] = date_text;
  }

  col_bt =
    "<div class='rightup-button'><button class='no-rd p0 button button--quiet' disabled><ons-icon icon='fa-" +
    visibility_icon +
    "' class='toot-right-icon'></ons-icon></button>" +
    col_bt +
    '</div>';

  if (note) alert_text = "<div class='alert_text'>" + note + '</div>';
  alert_text += col_bt;

  BoxData['toot_base_classes'] += page === 'near_federated' ? ' near_federated' : '';

  var toot_origin_domain =
    toot['account']['acct'] === toot['account']['username']
      ? inst
      : toot['account']['acct'].split('@')[1];

  toot['content'] = t_text(content, toot['emojis'], toot_origin_domain);

  BoxData['faved'] = toot['favourited'] ? ' fav-active' : '';
  BoxData['boosted'] = toot['reblogged'] ? ' boost-active' : '';

  BoxData['toot'] = toot;
  BoxData['bgpic'] = col_pic;
  BoxData['bgstyle'] = col_bg_st;
  BoxData['alert_text'] = alert_text;
  BoxData['no_icon'] = page === 'alert' && note && getConfig(2, 'alert_m') ? ' no_icon' : '';
  BoxData['namucard'] = namucard;
  BoxData['is_col'] = is_col;
  BoxData['visibility_icon'] = visibility_icon;
  BoxData['display_mode'] = mode;
  //BoxData['displayDate'] = displayTime('new', toot['created_at']);

  return tmpl('toot_full_tmpl', BoxData);
}

function toot_col(id) {
  var toot = $('.tootcontent_' + id),
    i = 0,
    mode,
    toot_b = document.getElementsByClassName('post_' + id),
    obj = $('.toot_col_' + id),
    tb = $('.tb_group_' + id);
  mode = toot[0].className.indexOf('toot-small') != -1;
  while (toot[i]) {
    if (mode) {
      $(toot[i]).removeClass('toot-small');
      obj[i].className = 'fa fa-fw fa-angle-double-up toot-right-icon toot_col_' + id;
      tb[i].className = 'toot-group tb_group_' + id;
      if (toot_b[i].dataset.bgpic) {
        toot_b[i].removeAttribute('style');
        $(toot_b[i]).removeClass('col_bg');
      }
    } else {
      $(toot[i]).addClass('toot-small');
      obj[i].className = 'fa fa-fw fa-angle-double-down toot-right-icon blue toot_col_' + id;
      tb[i].className = 'disable toot-group tb_group_' + id;
      if (toot_b[i].dataset.bgpic) {
        toot_b[i].setAttribute(
          'style',
          "background-image: url('" + toot_b[i].dataset.bgpic + "');"
        );
        $(toot_b[i]).addClass('col_bg');
      }
    }
    i++;
  }
}

function vote_item(q, obj, id) {
  Fetch('https://' + inst + '/api/v1/votes/' + id, {
    headers: {
      'content-type': 'application/json',
      Authorization: 'Bearer ' + now_userconf['token'],
    },
    method: 'POST',
    body: JSON.stringify({
      item_index: q,
    }),
  })
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        throw response;
      }
    })
    .then(function(json) {
      if (json.valid) {
        showtoast('vote-ok');
      } else {
        showtoast('vote-ng');
      }
      console.log(json);
    })
    .catch(error => {
      error.text().then(errorMessage => {
        getError('Error/vote', errorMessage);
      });
    });
}

function toot_action(action_mode) {
  var toot,
    i = 0,
    url = '',
    a_mode;
  id = event.srcElement.dataset.id;
  if (action_mode === 0) {
    toot = $('.tootfav_' + id);
    a_mode = toot[0].className.indexOf('fav-active') == -1;
    while (toot[i]) {
      if (a_mode) {
        url = '/favourite';
        $(toot[i]).addClass('fav-active');
      } else {
        url = '/unfavourite';
        $(toot[i]).removeClass('fav-active');
      }
      i++;
    }
  } else {
    toot = $('.tootbs_' + id);
    a_mode = toot[0].className.indexOf('boost-active') == -1;
    while (toot[i]) {
      if (a_mode) {
        url = '/reblog';
        $(toot[i]).addClass('boost-active');
      } else {
        url = '/unreblog';
        $(toot[i]).removeClass('boost-active');
      }
      i++;
    }
  }
  Fetch('https://' + inst + '/api/v1/statuses/' + id + url, {
    headers: {
      'content-type': 'application/json',
      Authorization: 'Bearer ' + now_userconf['token'],
    },
    method: 'POST',
  })
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        throw response;
      }
    })
    .then(function(json) {
      console.log('OK:' + action_mode);
    })
    .catch(function(error) {
      i = 0;
      if (action_mode === 0) {
        while (toot[i]) {
          if (a_mode) {
            $(toot[i]).removeClass('fav-active');
          } else {
            $(toot[i]).addClass('fav-active');
          }
          i++;
        }
      } else {
        while (toot[i]) {
          if (a_mode) {
            $(toot[i]).removeClass('boost-active');
          } else {
            $(toot[i]).addClass('boost-active');
          }
          i++;
        }
      }
      try {
        error.text().then(errorMessage => {
          getError('Error/toot_action', errorMessage);
        });
      } catch (e) {
        console.error(error);
      }
    });
}

function open_cw(id, btobj) {
  var cw = document.getElementById(id).className;
  if (cw == 'invisible') {
    //開く
    document.getElementById(id).className = '';
    btobj.className = 'cw-button button--large ' + button;
  } else {
    //閉じる
    document.getElementById(id).className = 'invisible';
    btobj.className = 'cw-button ' + large_quiet;
  }
}

function reply(id) {
  tmp_text_pre = '';
  var acct = '',
    i = 0;
  if (tl_postdata[id]['mentions'][0]) {
    while (tl_postdata[id]['mentions'][i]) {
      if (tl_postdata[id]['mentions'][i]['acct'] !== now_userconf['username']) {
        acct += '@' + tl_postdata[id]['mentions'][i]['acct'] + ' ';
      }
      i++;
    }
    tmp_text_pre = acct;
  }
  if (tl_postdata[id]['account']['acct'] !== now_userconf['username']) {
    tmp_text_pre += '@' + tl_postdata[id]['account']['acct'] + ' ';
  }
  tmp_post_reply = id;

  tmp_post_visibility =
    visibility_rank(tl_postdata[id]['visibility']) > visibility_rank(default_post_visibility)
      ? tl_postdata[id]['visibility']
      : default_post_visibility;

  loadNav('post.html', 'up');
}

function visibility_rank(mode) {
  var rank = 0;
  if (mode === 'public') rank = 1;
  else if (mode === 'unlisted') rank = 2;
  else if (mode === 'private') rank = 3;
  else if (mode === 'direct') rank = 4;

  return rank;
}

function visibility_name(mode) {
  var name = '';
  if (mode === 'public') name = 'globe';
  else if (mode === 'unlisted') name = 'unlock-alt';
  else if (mode === 'private') name = 'lock';
  else if (mode === 'direct') name = 'envelope';

  return name;
}

function pin_set(id) {
  var pin_mode = tl_postdata[id]['pinned'] ? '/unpin' : '/pin';
  Fetch('https://' + inst + '/api/v1/statuses/' + id + pin_mode, {
    headers: {
      'content-type': 'application/json',
      Authorization: 'Bearer ' + now_userconf['token'],
    },
    method: 'POST',
  })
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        throw response;
      }
    })
    .then(function(json) {
      if (json['id']) {
        tl_postdata[json['id']] = json;
        showtoast('ok_conf_2');
      }
    })
    .catch(error => {
      error.text().then(errorMessage => {
        getError('Error/pin_set', errorMessage);
      });
    });
}

function more(id) {
  var url = tl_postdata[id]['url'],
    acct = tl_postdata[id]['account']['acct'];
  more_status_id = '' + id;
  more_acct_id = tl_postdata[id]['account']['id'];
  if (now_userconf['id'] === tl_postdata[id]['account']['id']) {
    var pin =
      tl_postdata[id]['pinned'] === true
        ? i18next.t('actionsheet.toot.pin.unset')
        : i18next.t('actionsheet.toot.pin.set');
    ons
      .openActionSheet({
        cancelable: true,
        buttons: [
          i18next.t('actionsheet.toot.more'),
          i18next.t('actionsheet.toot.openbrowser'),
          i18next.t('actionsheet.toot.url'),
          i18next.t('actionsheet.toot.original_toot'),
          i18next.t('actionsheet.toot.near'),
          {
            label: pin,
            modifier: 'fa-thumb-tack',
          },
          {
            label: i18next.t('actionsheet.toot.delete'),
            modifier: 'destructive',
          },
          {
            label: i18next.t('navigation.cancel'),
            icon: 'md-close',
          },
        ],
      })
      .then(function(index) {
        if (index == 0) show_post(more_status_id);
        else if (index == 1) openURL(url);
        else if (index == 2) copy(url);
        else if (index == 3) original_post(more_status_id, url, acct);
        else if (index == 4) nearToot(more_status_id, acct.split('@')[1]);
        else if (index == 5) pin_set(more_status_id);
        else if (index == 6) delete_post();
      });
  } else {
    var bookmark =
      checkBookmark(id) === true
        ? i18next.t('actionsheet.toot.bookmark.unset')
        : i18next.t('actionsheet.toot.bookmark.set');
    ons
      .openActionSheet({
        cancelable: true,
        buttons: [
          i18next.t('actionsheet.toot.more'),
          i18next.t('actionsheet.toot.openbrowser'),
          i18next.t('actionsheet.toot.url'),
          i18next.t('actionsheet.toot.original_toot'),
          i18next.t('actionsheet.toot.near'),
          bookmark,
          {
            label: i18next.t('dialogs_js.report.title'),
            modifier: 'destructive',
          },
          {
            label: i18next.t('navigation.cancel'),
            icon: 'md-close',
          },
        ],
      })
      .then(function(index) {
        if (index == 0) show_post(more_status_id);
        else if (index == 1) openURL(url);
        else if (index == 2) copy(url);
        else if (index == 3) original_post(more_status_id, url, acct);
        else if (index == 4) nearToot(more_status_id, acct.split('@')[1]);
        else if (index == 5) changeBookmark(more_status_id);
        else if (index == 6) report();
      });
  }
}

function nearToot(id, domain) {
  var list = [
    {
      label: i18next.t('actionsheet.near.htl'),
      modifier: 'fa-home',
    },
    {
      label: i18next.t('actionsheet.near.ltl', { inst: inst }),
      modifier: 'fa-users',
    },
    {
      label: i18next.t('actionsheet.near.ftl', { inst: inst }),
      modifier: 'fa-globe',
    },
  ];
  if (domain) {
    list.push({
      label: i18next.t('actionsheet.near.ltl', { inst: domain }),
      icon: 'fa-users',
    });
    list.push({
      label: i18next.t('actionsheet.near.ftl', { inst: domain }),
      icon: 'fa-globe',
    });
  }
  list.push({ label: i18next.t('navigation.cancel'), icon: 'md-close' });
  ons
    .openActionSheet({
      title: i18next.t('actionsheet.near.title'),
      cancelable: true,
      buttons: list,
    })
    .then(function(index) {
      if (index == 0) show_post(id, 'home?');
      if (index == 1) show_post(id, 'public?local=true&');
      if (index == 2) show_post(id, 'public?');
      if (domain) {
        var origin_id = tl_postdata[id]['url'].split('/')[4];
        if (index == 3) show_post(id, 'public?local=true&', domain, origin_id);
        if (index == 4) show_post(id, 'public?', domain, origin_id);
      }
    });
}

function delete_post() {
  ons.notification
    .confirm(dialog_i18n('delete', 1), { title: dialog_i18n('delete') })
    .then(function(e) {
      if (e === 1) {
        Fetch('https://' + inst + '/api/v1/statuses/' + more_status_id, {
          headers: {
            'content-type': 'application/json',
            Authorization: 'Bearer ' + now_userconf['token'],
          },
          method: 'DELETE',
        })
          .then(function(response) {
            if (response.ok) {
              return response.json();
            } else {
              throw response;
            }
          })
          .then(function(json) {
            var card = $('.post_' + more_status_id),
              i = 0;
            while (card[i]) {
              card[i].parentNode.removeChild(card[i]);
              i++;
            }
            console.log('OK:del');
            showtoast('del-post-ok');
            more_acct_id = 0;
            more_status_id = 0;
          })
          .catch(function(error) {
            more_acct_id = 0;
            more_status_id = 0;
            error.text().then(errorMessage => {
              getError('Error/del_post', errorMessage);
            });
          });
      }
    });
}

function show_post(id, near, near_domain, origin_id) {
  var reshtml = '',
    d = 0,
    i = 0;
  loadNav('showtoot.html');
  Fetch('https://' + inst + '//api/v1/statuses/' + id, {
    headers: {
      'content-type': 'application/json',
      Authorization: 'Bearer ' + now_userconf['token'],
    },
    method: 'GET',
  })
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        throw response;
      }
    })
    .then(function(json_stat) {
      if (json_stat) {
        if (near) {
          var near_header = { 'content-type': 'application/json' };
          near_header['Authorization'] = near_domain ? null : 'Bearer ' + now_userconf['token'];

          var toot_origin_domain = near_domain ? near_domain : inst;
          if (!origin_id) origin_id = id;
          i = 0;
          reshtml += toot_card(json_stat, 'big', null, 'gold');
          Fetch(
            'https://' +
              toot_origin_domain +
              '/api/v1/timelines/' +
              near +
              'limit=10&max_id=' +
              origin_id,
            {
              headers: near_header,
              method: 'GET',
            }
          )
            .then(function(response) {
              if (response.ok) {
                return response.json();
              } else {
                throw response;
              }
            })
            .then(function(json_shita) {
              if (json_shita) {
                while (json_shita[i]) {
                  reshtml += toot_card(
                    json_shita[i],
                    'full',
                    null,
                    null,
                    near_domain ? 'near_federated' : null
                  );
                  i++;
                }
                document.getElementById('show_toot').innerHTML = reshtml;
              }
            })
            .catch(error => {
              error.text().then(errorMessage => {
                getError('Error/near_show_toot', errorMessage);
              });
            });
        } else {
          Fetch('https://' + inst + '//api/v1/statuses/' + id + '/context', {
            headers: {
              'content-type': 'application/json',
              Authorization: 'Bearer ' + now_userconf['token'],
            },
            method: 'GET',
          })
            .then(function(response) {
              if (response.ok) {
                return response.json();
              } else {
                throw response;
              }
            })
            .then(function(json) {
              while (json['ancestors'][d]) {
                reshtml += toot_card(json['ancestors'][d], null, null);
                d++;
              }
              d = 0;

              reshtml += toot_card(json_stat, 'big', null);

              while (json['descendants'][d]) {
                reshtml += toot_card(json['descendants'][d], null, null);
                d++;
              }

              document.getElementById('show_toot').innerHTML = reshtml;
            })
            .catch(error => {
              error.text().then(errorMessage => {
                getError('Error/show_toot_context', errorMessage);
              });
            });
        }
      }
    })
    .catch(error => {
      error.text().then(errorMessage => {
        getError('Error/show_post', errorMessage);
      });
    });
}

function report() {
  var rep = ons.notification
    .prompt(dialog_i18n('report', 1), { title: dialog_i18n('report') })
    .then(function(repcom) {
      if (repcom) {
        Fetch('https://' + inst + '/api/v1/reports', {
          headers: {
            'content-type': 'application/json',
            Authorization: 'Bearer ' + now_userconf['token'],
          },
          method: 'POST',
          body: JSON.stringify({
            account_id: more_acct_id,
            status_ids: [more_status_id],
            comment: repcom,
          }),
        })
          .then(function(response) {
            if (response.ok) {
              return response.json();
            } else {
              throw response;
            }
          })
          .then(function(json) {
            console.log('OK:rep');
            showtoast('report-post');
            more_acct_id = 0;
            more_status_id = 0;
          })
          .catch(function(error) {
            more_acct_id = 0;
            more_status_id = 0;
            error.text().then(errorMessage => {
              getError('Error/report', errorMessage);
            });
          });
      }
    });
}

function original_post(id, url, acct) {
  show('now_loading');
  Fetch(url, {
    method: 'GET',
  })
    .then(function(response) {
      if (response.ok) {
        return response.text();
      } else {
        throw response;
      }
    })
    .then(function(text) {
      var t = $(text)
        .filter("meta[property='og:description']")
        .attr('content');
      if (t) {
        document.getElementById('original_post_box').innerText = t;
        original_post_text = t;
        original_post_userid = acct;
        show('dialog-original_post');
      } else {
        showtoast('no-original_post');
      }
      hide('now_loading');
    })
    .catch(function(error) {
      hide('now_loading');
      error.text().then(errorMessage => {
        getError('Error/show_original_post', errorMessage);
      });
    });
}

function quote_toot(text, acct) {
  acct = '@' + acct;
  hide('dialog-original_post');
  post_pre(
    text +
      '\n' +
      i18next.t('original_toot.quote.prefix') +
      acct +
      i18next.t('original_toot.quote.suffix') +
      '\n',
    1
  );
}
