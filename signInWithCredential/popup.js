const button = document.querySelector('button')
const msg = document.querySelector('#message')

function $(selector) {
  return document.querySelector(selector)
}

$('#AuthProvider').addEventListener('change', e => {
  const {value} = e.target;
  msg.innerText = '';
  msg.className = '';
  $('.selected')?.classList.remove('selected')
  $(`#${value}`).classList.add('selected')
})

$('form').addEventListener('submit', e => {
  const authProvider = $('select').value
  const inputs = $('.selected').querySelectorAll('input')
  const data = Object.fromEntries([...inputs].map(i => [i.id, i.value]))
  msg.className = ''

  button.disabled = true;

  // The user has selected an auth provider and entered the required data.
  // Now we serialize the data and send it to the service worker for processing.
  // TODO update to async/await
  chrome.runtime.sendMessage({
    target: 'background',
    authProvider,
    data: {...data}
  }).then(result => {
    if (result.error) {
      throw new Error(result.error);
    }
    msg.classList.add('success');
    msg.innerText = `success: ${JSON.stringify(result,0,2)}`;
  }).catch(e => {
    msg.classList.add('error');
    msg.innerText = `error: ${JSON.stringify(e,0,2)}`;
  }).finally(() => {
    button.disabled = false;
  });

  e.preventDefault();
});
