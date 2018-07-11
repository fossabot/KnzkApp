function dock_button(id) {
  var data = getConfig(6, 't')[id];
  if (data === 'notification') {
    openTL('alert_nav');
  } else {
    TL_change(timeline_config.indexOf(data));
  }
}
// ["home","notification"]
