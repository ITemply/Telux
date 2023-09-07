function closeerrormodal() {
  document.getElementById('errormodal').style.display = 'none'
}

function errormodal(errorname, description) {
  document.getElementById('errormodal').style.display = 'block'
  document.getElementById('errormodaltitle').innerHTML = errorname
  document.getElementById('errormodaldescription').innerHTML = description
}

function searchtags() {
  const searchingtags = document.getElementById('searchtags').value
  const newtags = searchingtags.replace('#', '')

  log('Type/SE', 'Username: <b>' + localStorage.getItem('Username') + '</b> Query: <b>' + newtags + '</b>')
  
  window.location.href = '/search?query=' + newtags
}

function yourprofile() {
  const username = localStorage.getItem('Username')

  window.location.href = '/profile?u=' + username
}

async function loadpanel() {
  sendingdata = {username: localStorage.getItem('Username'), password: localStorage.getItem('Password')}
  
  try {
    const senddata = await fetch('/panel', {
      method: 'POST',
      body: JSON.stringify(sendingdata),
      cache: 'default'
    })

    const respondjson = await senddata.json()
    const newjson = JSON.stringify(respondjson)
    const newstatus = JSON.parse(newjson)
    const information = newstatus.information

    if (information == 'No Access') {
      window.location.href = '/feed'
      return
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function banuser() {
  sendingdata = {username: localStorage.getItem('Username'), password: localStorage.getItem('Password'), command: 'CType/UBAN', exdata: document.getElementById('banusername').value}
  
  try {
    const senddata = await fetch('/sendcommand', {
      method: 'POST',
      body: JSON.stringify(sendingdata),
      cache: 'default'
    })

    const respondjson = await senddata.json()
    const newjson = JSON.stringify(respondjson)
    const newstatus = JSON.parse(newjson)
    const information = newstatus.information

    if (information == 'No Access') {
      window.location.href = '/feed'
      return
    }

    if (information == 'Success') {
      errormodal('Ban Success', 'Successfully banned, <b>' + document.getElementById('banusername').value + '</b>!')
      return
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function ipban() {
  sendingdata = {username: localStorage.getItem('Username'), password: localStorage.getItem('Password'), command: 'CType/IPBAN', exdata: document.getElementById('ipban').value}
  
  try {
    const senddata = await fetch('/sendcommand', {
      method: 'POST',
      body: JSON.stringify(sendingdata),
      cache: 'default'
    })

    const respondjson = await senddata.json()
    const newjson = JSON.stringify(respondjson)
    const newstatus = JSON.parse(newjson)
    const information = newstatus.information

    if (information == 'No Access') {
      window.location.href = '/feed'
      return
    }

    if (information == 'Success') {
      errormodal('IP Ban Success', 'Successfully IP banned, <b>' + document.getElementById('ipban').value + '</b>!')
      return
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function unbanuser() {
  sendingdata = {username: localStorage.getItem('Username'), password: localStorage.getItem('Password'), command: 'CType/UNBAN', exdata: document.getElementById('unbanuser').value}
  
  try {
    const senddata = await fetch('/sendcommand', {
      method: 'POST',
      body: JSON.stringify(sendingdata),
      cache: 'default'
    })

    const respondjson = await senddata.json()
    const newjson = JSON.stringify(respondjson)
    const newstatus = JSON.parse(newjson)
    const information = newstatus.information

    if (information == 'No Access') {
      window.location.href = '/feed'
      return
    }

    if (information == 'Success') {
      errormodal('Unban Success', 'Successfully unbanned, <b>' + document.getElementById('unbanuser').value + '</b>!')
      return
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function unbanip() {
  sendingdata = {username: localStorage.getItem('Username'), password: localStorage.getItem('Password'), command: 'CType/UNIPBAN', exdata: document.getElementById('unbanip').value}
  
  try {
    const senddata = await fetch('/sendcommand', {
      method: 'POST',
      body: JSON.stringify(sendingdata),
      cache: 'default'
    })

    const respondjson = await senddata.json()
    const newjson = JSON.stringify(respondjson)
    const newstatus = JSON.parse(newjson)
    const information = newstatus.information

    if (information == 'No Access') {
      window.location.href = '/feed'
      return
    }

    if (information == 'Success') {
      errormodal('UnIP Ban Success', 'Successfully UnIP banned, <b>' + document.getElementById('unbanip').value + '</b>!')
      return
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function deletepost() {
  sendingdata = {username: localStorage.getItem('Username'), password: localStorage.getItem('Password'), command: 'CType/DELPOST', exdata: document.getElementById('deletepostid').value}
  
  try {
    const senddata = await fetch('/sendcommand', {
      method: 'POST',
      body: JSON.stringify(sendingdata),
      cache: 'default'
    })

    const respondjson = await senddata.json()
    const newjson = JSON.stringify(respondjson)
    const newstatus = JSON.parse(newjson)
    const information = newstatus.information

    if (information == 'No Access') {
      window.location.href = '/feed'
      return
    }

    if (information == 'Success') {
      errormodal('Delete Post Success', 'Successfully deleted post ID, <b>' + document.getElementById('deletepostid').value + '</b>!')
      return
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function deletecomment() {
  sendingdata = {username: localStorage.getItem('Username'), password: localStorage.getItem('Password'), command: 'CType/DELCOM', exdata: document.getElementById('deletecommentid').value}
  
  try {
    const senddata = await fetch('/sendcommand', {
      method: 'POST',
      body: JSON.stringify(sendingdata),
      cache: 'default'
    })

    const respondjson = await senddata.json()
    const newjson = JSON.stringify(respondjson)
    const newstatus = JSON.parse(newjson)
    const information = newstatus.information

    if (information == 'No Access') {
      window.location.href = '/feed'
      return
    }

    if (information == 'Success') {
      errormodal('Delete Comment Success', 'Successfully deleted comment ID, <b>' + document.getElementById('deletecommentid').value + '</b>!')
      return
    }
  } catch (error) {
    console.error("Error:", error);
  }
}