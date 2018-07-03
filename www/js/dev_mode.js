function OpenDevMode() {
  ons
    .openActionSheet({
      title: 'デベロッパーモード',
      cancelable: true,
      buttons: [
        'システム情報/ログを表示',
        {
          label: i18next.t('navigation.cancel'),
          icon: 'md-close',
        },
      ],
    })
    .then(function(index) {
      if (index === 0) DevModeLog();
      else if (index === 999) {
        //WIP
        ons.notification
          .confirm(i18next.t('bookmark.clear1.text'), { title: 'CAUION' })
          .then(function(e) {
            if (e === 1) {
              var bookmark = loadBookmark();
              bookmark[inst] = [];
              saveBookmark(bookmark);
              BackTab();
            }
          });
      }
    });
}

function DevModeLog() {}
