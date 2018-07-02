function OpenDevMode() {
  ons.openActionSheet({
    title: 'デベロッパーモード',
    cancelable: true,
    buttons: [
      'システム情報/ログを表示',
      {
        label: '設定データを編集',
        modifier: 'destructive'
      },
      {
        label: i18next.t('navigation.cancel'),
        icon: 'md-close'
      }
    ]
  }).then(function (index) {
    if (index === 0) DevModeLog();
    else if (index === 1) {
      ons.notification
        .confirm(
          i18next.t('bookmark.clear1.text', {
            inst: inst,
            interpolation: { escapeValue: false },
          }),
          { title: 'CAUION' }
        )
        .then(function (e) {
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
