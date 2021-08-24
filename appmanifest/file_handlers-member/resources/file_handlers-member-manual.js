// Since this is a manual test, disable the automatic timeout.
setup({explicit_timeout: true});

const reportProblem = text => {
  document.getElementById('problems').hidden = false;
  var problem = document.createElement('li');
  problem.textContent = text;
  document.getElementById('problem-list').appendChild(problem);
};

// Redirect to https if using http, because File System Access API (previously
// Native FileSystem API) isn't supported in http.
if (location.protocol !== 'https:') {
  location.replace(
    `https:${location.href.substring(location.protocol.length)}`
  );
}

test(function() {
  assert_true('serviceWorker' in navigator);
}, 'serviceWorker exists')

navigator.serviceWorker.register(
    'file_handlers-member-manual-service-worker.js');

test(function() {
  assert_true('launchQueue' in window);
}, 'File Handling API enabled')

test(function() {
  assert_true('showOpenFilePicker' in window);
}, 'File System Access API enabled')

var t = async_test('Launch queue')

window.launchQueue.setConsumer(async launchParams => {
  t.step(function() {
    assert_equals(
        launchParams.files.length, 1, 'Wrong number of files found');
  });

  var readHandle;
  promise_test(testCase => {
    return launchParams.files[0].getFile().then(function(result) {
      readHandle = result;
      assert_equals(result.name, 'file_handlers-sample-file.txt');
    });
  }, 'File handle and name');

  promise_test(function() {
    return readHandle.text().then(function(result) {
      assert_equals(result, 'File handling WPT - Hello world!\n')
    });
  }, 'File contents');

  t.done();
});
