async function log(datatype, collectdata) {
  const sendinglogdata = {datatype: datatype, collectdata: collectdata}

  try {
    const senddata = await fetch('/log', {
      method: 'POST',
      body: JSON.stringify(sendinglogdata),
      cache: 'default'
    })
  } catch (error) {
    console.error("Error:", error);
  }
}

async function getip() {
  const ipawait = await fetch('https://api.ipify.org/?format=json')
  const ipform = await ipawait.json()
  const newipjson = JSON.stringify(ipform)
  const lip = JSON.parse(newipjson)
  const ip = lip.ip

  return ip
}

function closeerrormodal() {
  document.getElementById('errormodal').style.display = 'none'
}

function closepostmodal() {
  document.getElementById('postmodal').style.display = 'none'
}

function createaccountlink() {
  window.location.href = '/createaccount'
}

function errormodal(errorname, description) {
  document.getElementById('errormodal').style.display = 'block'
  document.getElementById('errormodaltitle').innerHTML = errorname
  document.getElementById('errormodaldescription').innerHTML = description
}

function sendpost(postname, description) {
  document.getElementById('postmodal').style.display = 'block'
  document.getElementById('postname').innerHTML = postname
  document.getElementById('postdescription').innerHTML = description
}

function editprofilebutton() {
    errormodal('Edit Profile', 'You can edit everything about your profile from your banner, profile picture, description, and title.')
}

function sendpostbutton() {
  sendpost('Send Post', 'Send a post with anything that is on your mind or with images. You can use # as tags. Example, "#Gaming"')
}

async function checkuser(username, password) {
  const sendingdata = {username: username, password: password}

  try {
    const senddata = await fetch('/checkuser', {
      method: 'POST',
      body: JSON.stringify(sendingdata),
      cache: 'default'
    })

    const respondjson = await senddata.json()
    const newjson = JSON.stringify(respondjson)
    const newstatus = JSON.parse(newjson)
    const status = newstatus.status

    if (status == 'Check Error') {
      return false
    }

    if (status == 'Check Success') {
      return true
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function createaccount() {
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value

  if (username == '') {
    errormodal('Username Error', 'Please input a username.')
    return
  }
  
  if (password == '') {
    errormodal('Password Error', 'Please input a password.')
    return
  }

  const sendingdata = {username: username, password: password}

  try {
    const senddata = await fetch('/createaccount', {
      method: 'POST',
      body: JSON.stringify(sendingdata),
      cache: 'default'
    })

    const respondjson = await senddata.json()
    const newjson = JSON.stringify(respondjson)
    const newstatus = JSON.parse(newjson)
    const status = newstatus.status

    if (status == 'Username Taken') {
      errormodal('Username Error', 'The username you inputed is already taken by another user.')
      return
    }

    if (status == 'Account Creation Disabled') {
      errormodal('Account Creation Error', 'Telux was unable to process your requets due to a high volume of accounts being created at this time. Please check back at a later time.')
      return
    }

    if (status == 'Account Created') {
      errormodal('Account Created', 'Your account has been created, you can now return to the login page and login to your account.')
      log('Type/AC', username)
      getip().then(ip => log('Type/IPL', 'Username: ' + username + ' Public IP: ' + ip))
      return
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function logintoaccount() {
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value

  if (username == '') {
    errormodal('Username Error', 'Please input a username.')
    return
  }
  
  if (password == '') {
    errormodal('Password Error', 'Please input a password.')
    return
  }

  const sendingdata = {username: username, password: password}

  try {
    const senddata = await fetch('/login', {
      method: 'POST',
      body: JSON.stringify(sendingdata),
      cache: 'default'
    })

    const respondjson = await senddata.json()
    const newjson = JSON.stringify(respondjson)
    const newstatus = JSON.parse(newjson)
    const status = newstatus.status

    if (status == 'Login Error') {
      errormodal('Login Error', 'The username or password you inputed are incorrect. Please try again with a differnet username or password.')
      return
    }

    if (status == 'Login Success') {
      localStorage.setItem('Username', username)
      localStorage.setItem('Password', password)
      
      log('Type/AL', username)
      window.location.href = '/profile?u=' + username
      return
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function logintoaccountlink() {
  window.location.href = '/login'
}

async function loadprofile() {
  const link = window.location.search
  const args = new URLSearchParams(link)
  let user = args.get('u')

  if (user == '') {
    user = 'Admin'
  }

  const sendingdata = {username: user}
  
  try {
    const senddata = await fetch('/profile', {
      method: 'POST',
      body: JSON.stringify(sendingdata),
      cache: 'default'
    })

    const respondjson = await senddata.json()
    const newjson = JSON.stringify(respondjson)
    const newstatus = JSON.parse(newjson)
    const information = newstatus.information

    if (information == 'Profile Not Found') {
      document.getElementById('username').innerHTML = 'User Not Found'
      document.getElementById('description').innerHTML = 'Description Not Found'
      document.getElementById('title').innerHTML = 'Title Not Found'
      document.getElementById('joindate').innerHTML = 'Join Date Not Found'

      document.getElementById('banner').src = 'static/images/notfound.png'
      document.getElementById('pfp').src = 'static/images/notfound.png'
      
      return
    }
    
    const infoarray = information.split('=')

    const username = infoarray[0]
    const description = infoarray[1]
    const title = infoarray[2]
    const joindate = infoarray[3]
    const pfp = infoarray[4]
    const banner = infoarray[5]

    const splitjdate = joindate.split('-')

    const formattedjdate = splitjdate[1] + '/' + splitjdate[2] + '/' + splitjdate[0]

    document.getElementById('username').innerHTML = username
    document.getElementById('description').innerHTML = description
    document.getElementById('title').innerHTML = title
    document.getElementById('joindate').innerHTML = formattedjdate

    document.getElementById('banner').src = banner
    document.getElementById('pfp').src = pfp

    if (localStorage.getItem('Username') == user) {
      document.getElementById('editprofilebtn').style.display = 'block'
      document.getElementById('logoutbtn').style.display = 'block'
    }
    
  } catch (error) {
    console.error("Error:", error);
  }
}

async function savebio() {
  const pfp = document.getElementById('newpfp').files[0]
  const banner = document.getElementById('newbanner').files[0]
  const description = document.getElementById('newdesc').value
  const title = document.getElementById('newtitle').value

  let sendingpfp = 'true'
  let sendingbanner = 'true'

  if (pfp === undefined) {
    sendingpfp = 'false'
  }

  if (banner === undefined) {
    sendingbanner = 'false'
  }
    
  let newdat = new FormData()
  newdat.append('sendingpfp', sendingpfp)
  newdat.append('sendingbanner', sendingbanner)
  newdat.append('description', description)
  newdat.append('title', title)
  newdat.append('username', localStorage.getItem('Username'))
  newdat.append('password', localStorage.getItem('Password'))
  newdat.append('pfp', pfp)
  newdat.append('banner', banner)

  if (checkuser(localStorage.getItem('Username'), localStorage.getItem('Password'))) {
    try {
      const senddata = await fetch('/changeprofile', {
        method: 'POST',
        body: newdat,
        cache: 'default'
      })
      closeerrormodal()
      log('Type/UP', 'Username: <b>' + localStorage.getItem('Username') + '</b> Description: <b>' + description + '</b> Title: <b>' + title + '</b>')
      window.location.reload()
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

async function getpostsuser() {
  const link = window.location.search
  const args = new URLSearchParams(link)
  let user = args.get('u')

  const sendingdata = {username: user}

   try {
    const senddata = await fetch('/getpostsuser', {
      method: 'POST',
      body: JSON.stringify(sendingdata),
      cache: 'default'
    })

    const respondjson = await senddata.json()
    const newjson = JSON.stringify(respondjson)
    const newstatus = JSON.parse(newjson)
    const information = newstatus.information

    if (information == 'No Posts') {
      var tdiv = '<div class="post"><br><center><span>No Posts Found ):</span></center></div><br><div class="spacer"></div></div>'
  
      const postsdiv = document.getElementById('postsdiv')
      const newdiv = tdiv + postsdiv.innerHTML
      document.getElementById('postsdiv').innerHTML = newdiv
      
      return
    }

    const informationarray = information.split('|')

    for (const element of informationarray) {
      if (element == '') {
        return
      }

      const postinfo = element.split('=')
      const username = postinfo[0]
      const pfp = postinfo[1]
      const text = postinfo[2]
      const id = postinfo[3]
      const date = postinfo[4]
      const posttype = postinfo[5]

      const splitjdate = date.split('-')

      const formattedjdate = splitjdate[1] + '/' + splitjdate[2] + '/' + splitjdate[0]

      if (posttype == 'posttype/t') {
        var tdiv = '<div class="post"><br><div class="toppfpbar"><a href="/profile?u=' + username + '"><img class="postpfp" src="' + pfp + '"></a><span class="postusername">' + username + '</span><span class="postdate">' + formattedjdate + '</span></div><a href="' + '/post?id=' + id + '"><div class="postcontent"><span>' + text + '</span></div></a><div class="spacer"></div></div>'
  
        const postsdiv = document.getElementById('postsdiv')
        const newdiv = tdiv + postsdiv.innerHTML
        document.getElementById('postsdiv').innerHTML = newdiv
      } else if (posttype == 'posttype/m') {
        const media = postinfo[6]

        var tdiv = '<div class="post"><br><div class="toppfpbar"><a href="/profile?u=' + username + '"><img class="postpfp" src="' + pfp + '"></a><span class="postusername">' + username + '</span><span class="postdate">' + formattedjdate + '</span></div><a href="' + '/post?id=' + id + '"><div class="postcontent"><span>' + text + '</span><br><br><img src="' + media + '"></></></div></a><div class="spacer"></div></div>'
  
        const postsdiv = document.getElementById('postsdiv')
        const newdiv = tdiv + postsdiv.innerHTML
        document.getElementById('postsdiv').innerHTML = newdiv
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function onprofileload() {
  getpostsuser()
  loadprofile()
}

async function sendpostserv() {
  const media = document.getElementById('postmedia').files[0]
  const posttext = document.getElementById('posttext').value

  let sendingpfp = 'true'

  if (document.getElementById('postmedia').files.length == 0) {
    sendingpfp = 'false'
  }

  if (posttext == '') {
    errormodal('Text Problem', 'You must have some sort of text when sending a post.')
    return
  }
    
  let newdat = new FormData()
  newdat.append('sendingpfp', sendingpfp)
  newdat.append('posttext', posttext)
  newdat.append('username', localStorage.getItem('Username'))
  newdat.append('password', localStorage.getItem('Password'))
  newdat.append('media', media)

  if (checkuser(localStorage.getItem('Username'), localStorage.getItem('Password'))) {
    try {
      const senddata = await fetch('/sendpost', {
        method: 'POST',
        body: newdat,
        cache: 'default'
      })
      log('Type/PC', 'Username: <b>' + localStorage.getItem('Username') + '</b> Post Text: <b>' + posttext + '</b>')
      window.location.reload()
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

async function loadfeed() {
  const link = window.location.search
  const args = new URLSearchParams(link)
  let user = args.get('u')

  const sendingdata = {action: 'feed posts'}

   try {
    const senddata = await fetch('/feed', {
      method: 'POST',
      body: JSON.stringify(sendingdata),
      cache: 'default'
    })

    const respondjson = await senddata.json()
    const newjson = JSON.stringify(respondjson)
    const newstatus = JSON.parse(newjson)
    const information = newstatus.information

    if (information == 'No Posts') {
      var tdiv = '<div class="post"><br><center><span>No Posts Found ):</span></center></div><br><div class="spacer"></div></div>'
  
      const postsdiv = document.getElementById('postsdiv')
      const newdiv = tdiv + postsdiv.innerHTML
      document.getElementById('postsdiv').innerHTML = newdiv
      
      return
    }

    const informationarray = information.split('|')

    for (const element of informationarray) {
      if (element == '') {
        return
      }

      const postinfo = element.split('=')
      const username = postinfo[0]
      const pfp = postinfo[1]
      const text = postinfo[2]
      const id = postinfo[3]
      const date = postinfo[4]
      const posttype = postinfo[5]

      const splitjdate = date.split('-')

      const formattedjdate = splitjdate[1] + '/' + splitjdate[2] + '/' + splitjdate[0]

      if (posttype == 'posttype/t') {
        var tdiv = '<div class="post"><br><div class="toppfpbar"><a href="/profile?u=' + username + '"><img class="postpfp" src="' + pfp + '"></a><span class="postusername">' + username + '</span><span class="postdate">' + formattedjdate + '</span></div><a href="' + '/post?id=' + id + '"><div class="postcontent"><span>' + text + '</span></div></a><div class="spacer"></div></div>'
  
        const postsdiv = document.getElementById('postsdiv')
        const newdiv = tdiv + postsdiv.innerHTML
        document.getElementById('postsdiv').innerHTML = newdiv
      } else if (posttype == 'posttype/m') {
        const media = postinfo[6]

        var tdiv = '<div class="post"><br><div class="toppfpbar"><a href="/profile?u=' + username + '"><img class="postpfp" src="' + pfp + '"></a><span class="postusername">' + username + '</span><span class="postdate">' + formattedjdate + '</span></div><a href="' + '/post?id=' + id + '"><div class="postcontent"><span>' + text + '</span><br><br><img src="' + media + '"></></></div></a><div class="spacer"></div></div>'
  
        const postsdiv = document.getElementById('postsdiv')
        const newdiv = tdiv + postsdiv.innerHTML
        document.getElementById('postsdiv').innerHTML = newdiv
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function yourprofile() {
  const username = localStorage.getItem('Username')

  window.location.href = '/profile?u=' + username
}

async function loadmore() {
  const link = window.location.search
  const args = new URLSearchParams(link)
  let user = args.get('u')

  const sendingdata = {action: 'feed posts'}

   try {
    const senddata = await fetch('/feed', {
      method: 'POST',
      body: JSON.stringify(sendingdata),
      cache: 'default'
    })

    const respondjson = await senddata.json()
    const newjson = JSON.stringify(respondjson)
    const newstatus = JSON.parse(newjson)
    const information = newstatus.information

    if (information == 'No Posts') {
      var tdiv = '<div class="post"><br><center><span>No Posts Found ):</span></center></div><br><div class="spacer"></div></div>'
  
      const postsdiv = document.getElementById('postsdiv')
      const newdiv = tdiv + postsdiv.innerHTML
      document.getElementById('postsdiv').innerHTML = newdiv
      
      return
    }

    const informationarray = information.split('|')

    for (const element of informationarray) {
      if (element == '') {
        return
      }

      const postinfo = element.split('=')
      const username = postinfo[0]
      const pfp = postinfo[1]
      const text = postinfo[2]
      const id = postinfo[3]
      const date = postinfo[4]
      const posttype = postinfo[5]

      const splitjdate = date.split('-')

      const formattedjdate = splitjdate[1] + '/' + splitjdate[2] + '/' + splitjdate[0]

      if (posttype == 'posttype/t') {
        var tdiv = '<div class="post"><br><div class="toppfpbar"><a href="/profile?u=' + username + '"><img class="postpfp" src="' + pfp + '"></a><span class="postusername">' + username + '</span><span class="postdate">' + formattedjdate + '</span></div><a href="' + '/post?id=' + id + '"><div class="postcontent"><span>' + text + '</span></div></a><div class="spacer"></div></div>'
  
        const postsdiv = document.getElementById('postsdiv')
        const newdiv = tdiv + postsdiv.innerHTML
        document.getElementById('postsdiv').innerHTML = newdiv
      } else if (posttype == 'posttype/m') {
        const media = postinfo[6]

        var tdiv = '<div class="post"><br><div class="toppfpbar"><a href="/profile?u=' + username + '"><img class="postpfp" src="' + pfp + '"></a><span class="postusername">' + username + '</span><span class="postdate">' + formattedjdate + '</span></div><a href="' + '/post?id=' + id + '"><div class="postcontent"><span>' + text + '</span><br><br><img src="' + media + '"></></></div></a><div class="spacer"></div></div>'
  
        const postsdiv = document.getElementById('postsdiv')
        const newdiv = tdiv + postsdiv.innerHTML
        document.getElementById('postsdiv').innerHTML = newdiv
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function loadposts() {
  const link = window.location.search
  const args = new URLSearchParams(link)
  let id = args.get('id')

  const sendingdata = {postid: id}

   try {
    const senddata = await fetch('/post', {
      method: 'POST',
      body: JSON.stringify(sendingdata),
      cache: 'default'
    })

    const respondjson = await senddata.json()
    const newjson = JSON.stringify(respondjson)
    const newstatus = JSON.parse(newjson)
    const information = newstatus.information

    if (information == 'No Posts') {
      var tdiv = '<div class="post"><br><center><span>No Posts Found ):</span></center></div><br><div class="spacer"></div></div>'
  
      const postsdiv = document.getElementById('postsdiv')
      const newdiv = tdiv + postsdiv.innerHTML
      document.getElementById('postsdiv').innerHTML = newdiv
      
      return
    }

    const informationarray = information.split('|')

    for (const element of informationarray) {
      if (element == '') {
        return
      }

      const postinfo = element.split('=')
      const username = postinfo[0]
      const pfp = postinfo[1]
      const text = postinfo[2]
      const id = postinfo[3]
      const date = postinfo[4]
      const posttype = postinfo[5]

      const splitjdate = date.split('-')

      const formattedjdate = splitjdate[1] + '/' + splitjdate[2] + '/' + splitjdate[0]

      if (posttype == 'posttype/t') {
        var tdiv = '<div class="post"><br><div class="toppfpbar"><a href="/profile?u=' + username + '"><img class="postpfp" src="' + pfp + '"></a><span class="postusername">' + username + '</span><span class="postdate">' + formattedjdate + '</span></div><div class="postcontent"><span>' + text + '</span></div><div class="spacer"></div></div>'
  
        const postsdiv = document.getElementById('postsdiv')
        const newdiv = tdiv + postsdiv.innerHTML
        document.getElementById('postsdiv').innerHTML = newdiv
      } else if (posttype == 'posttype/m') {
        const media = postinfo[6]

        var tdiv = '<div class="post"><br><div class="toppfpbar"><a href="/profile?u=' + username + '"><img class="postpfp" src="' + pfp + '"></a><span class="postusername">' + username + '</span><span class="postdate">' + formattedjdate + '</span></div><a href="' + media + '"><div class="postcontentb"><span>' + text + '</span><br><br><img src="' + media + '"></></></div></a><div class="spacer"></div></div>'
  
        const postsdiv = document.getElementById('postsdiv')
        const newdiv = tdiv + postsdiv.innerHTML
        document.getElementById('postsdiv').innerHTML = newdiv
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function getcomments() {
  const link1 = window.location.search
  const args1 = new URLSearchParams(link1)
  let postid = args1.get('id')

  const sendingdata1 = {postid: postid}

  try {
    const senddata1 = await fetch('/getcomments', {
      method: 'POST',
      body: JSON.stringify(sendingdata1),
      cache: 'default'
    })

    const respondjson1 = await senddata1.json()
    const newjson1 = JSON.stringify(respondjson1)
    const newstatus1 = JSON.parse(newjson1)
    const information1 = newstatus1.information

    if (information1 == 'No Comments') {
      var tdiv1 = '<div class="post"><br><center><span>No Comments Found ):</span></center></div><br><div class="spacer"></div></div>'
  
      const postsdiv1 = document.getElementById('commentsdiv')
      const newdiv1 = tdiv1 + postsdiv.innerHTML
      document.getElementById('commentsdiv').innerHTML = newdiv1
      
      return
    }

    const informationarray1 = information1.split('|')

    for (const element1 of informationarray1) {
      if (element1 == '') {
        return
      }

      const postinfo1 = element1.split('=')
      const username1 = postinfo1[0]
      const pfp1 = postinfo1[1]
      const text1 = postinfo1[2]
      const id1 = postinfo1[3]
      const date1 = postinfo1[4]

      const splitjdate1 = date1.split('-')

      const formattedjdate1 = splitjdate1[1] + '/' + splitjdate1[2] + '/' + splitjdate1[0]

      var tdiv1 = '<div class="post"><br><div class="toppfpbar"><a href="/profile?u=' + username1 + '"><img class="postpfp" src="' + pfp1 + '"></a><span class="postusername">' + username1 + '</span><span class="postdate">' + formattedjdate1 + '</span></div><div class="postcontent"><span>' + text1 + '</span></div></a><span class="postid">' + id1 + '</span><div class="spacer"></div></div>'
  
      const postsdiv1 = document.getElementById('commentsdiv')
      const newdiv1 = tdiv1 + postsdiv1.innerHTML
      document.getElementById('commentsdiv').innerHTML = newdiv1
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function loadpostpage() {
  getcomments()
  setTimeout(() => { loadposts() }, 100)
}

async function sendcomment() {
  const link1 = window.location.search
  const args1 = new URLSearchParams(link1)
  let postid = args1.get('id')
  const commenttext = document.getElementById('commentinput').value

  let newdat = new FormData()
  newdat.append('commenttext', commenttext)
  newdat.append('username', localStorage.getItem('Username'))
  newdat.append('password', localStorage.getItem('Password'))
  newdat.append('id', postid)

  if (checkuser(localStorage.getItem('Username'), localStorage.getItem('Password'))) {
    try {
      const senddata = await fetch('/sendcomment', {
        method: 'POST',
        body: newdat,
        cache: 'default'
      })
      log('Type/CC', 'Username: <b>' + localStorage.getItem('Username') + '</b> Comment Text: <b>' + commenttext + '</b> Post ID: <b>' + postid + '</b>')
      window.location.reload()
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

async function loadsearch() {
  const link2 = window.location.search
  const args2 = new URLSearchParams(link2)
  let searchq = args2.get('query')

  const sendingdata1 = {query: searchq}

  try {
    const senddata1 = await fetch('/search', {
      method: 'POST',
      body: JSON.stringify(sendingdata1),
      cache: 'default'
    })

    const respondjson1 = await senddata1.json()
    const newjson1 = JSON.stringify(respondjson1)
    const newstatus1 = JSON.parse(newjson1)
    const information1 = newstatus1.information

    if (information1 == 'No Posts') {
      var tdiv1 = '<div class="post"><br><center><span>No Posts Tagged With: <b>' + searchq + '</b> ):</span></center></div><br><div class="spacer"></div></div>'
  
      const postsdiv1 = document.getElementById('postsdiv')
      const newdiv1 = tdiv1 + postsdiv.innerHTML
      document.getElementById('postsdiv').innerHTML = newdiv1
      
      return
    }

    const informationarray1 = information1.split('|')

    for (const element of informationarray1) {
      if (element == '') {
        return
      }

      const postinfo = element.split('=')
      const username = postinfo[0]
      const pfp = postinfo[1]
      const text = postinfo[2]
      const id = postinfo[3]
      const date = postinfo[4]
      const posttype = postinfo[5]

      const splitjdate = date.split('-')

      const formattedjdate = splitjdate[1] + '/' + splitjdate[2] + '/' + splitjdate[0]

      if (posttype == 'posttype/t') {
        var tdiv = '<div class="post"><br><div class="toppfpbar"><a href="/profile?u=' + username + '"><img class="postpfp" src="' + pfp + '"></a><span class="postusername">' + username + '</span><span class="postdate">' + formattedjdate + '</span></div><a href="' + '/post?id=' + id + '"><div class="postcontent"><span>' + text + '</span></div></a><div class="spacer"></div></div>'
  
        const postsdiv = document.getElementById('postsdiv')
        const newdiv = tdiv + postsdiv.innerHTML
        document.getElementById('postsdiv').innerHTML = newdiv
      } else if (posttype == 'posttype/m') {
        const media = postinfo[6]

        var tdiv = '<div class="post"><br><div class="toppfpbar"><a href="/profile?u=' + username + '"><img class="postpfp" src="' + pfp + '"></a><span class="postusername">' + username + '</span><span class="postdate">' + formattedjdate + '</span></div><a href="' + media + '"><div class="postcontentb"><span>' + text + '</span><br><br><img src="' + media + '"></></></div></a><div class="spacer"></div></div>'
  
        const postsdiv = document.getElementById('postsdiv')
        const newdiv = tdiv + postsdiv.innerHTML
        document.getElementById('postsdiv').innerHTML = newdiv
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function searchtags() {
  const searchingtags = document.getElementById('searchtags').value
  const newtags = searchingtags.replace('#', '')

  log('Type/SE', 'Username: <b>' + localStorage.getItem('Username') + '</b> Query: <b>' + newtags + '</b>')
  
  window.location.href = '/search?query=' + newtags
}

async function loadlogs() {
  sendingdata = {username: localStorage.getItem('Username'), password: localStorage.getItem('Password')}
  
  try {
    const senddata = await fetch('/logs', {
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

    const informationarray = information.split('|')

    const accountcreationlogs = informationarray[0]
    const accountloginlogs = informationarray[1]
    const profileupdatedlogs = informationarray[2]
    const usersearchedlogs = informationarray[3]
    const usercreatedpostlogs = informationarray[4]
    const usercommentedlogs = informationarray[5]
    const iplogs = informationarray[6]
    const ipbanlogs = informationarray[7]
    const userbanlogs = informationarray[8]

    if (accountcreationlogs.lenght != 0) {
      Array.prototype.forEach.call(accountcreationlogs.split('='), (element) => {
        if (element == '') {
          return
        }

        var tdiv = '<span>' + element + '</span><br>'
  
        const newelement = document.getElementById('accountcreationlogs')
        const newdiv = tdiv + newelement.innerHTML
        document.getElementById('accountcreationlogs').innerHTML = newdiv
      })
    }
    
   if (accountloginlogs.lenght != 0) {
      Array.prototype.forEach.call(accountloginlogs.split('='), (element) => {
        if (element == '') {
          return
        }

        var tdiv = '<span>' + element + '</span><br>'
  
        const newelement = document.getElementById('accountloginlogs')
        const newdiv = tdiv + newelement.innerHTML
        document.getElementById('accountloginlogs').innerHTML = newdiv
      })
    }

    if (profileupdatedlogs.lenght != 0) {
      Array.prototype.forEach.call(profileupdatedlogs.split('='), (element) => {
        if (element == '') {
          return
        }

        var tdiv = '<span>' + element + '</span><br>'
  
        const newelement = document.getElementById('profileupdatedlogs')
        const newdiv = tdiv + newelement.innerHTML
        document.getElementById('profileupdatedlogs').innerHTML = newdiv
      })
    }

    if (usersearchedlogs.lenght != 0) {
      Array.prototype.forEach.call(usersearchedlogs.split('='), (element) => {
        if (element == '') {
          return
        }

        var tdiv = '<span>' + element + '</span><br>'
  
        const newelement = document.getElementById('usersearchedlogs')
        const newdiv = tdiv + newelement.innerHTML
        document.getElementById('usersearchedlogs').innerHTML = newdiv
      })
    }

    if (usercreatedpostlogs.lenght != 0) {
      Array.prototype.forEach.call(usercreatedpostlogs.split('='), (element) => {
        if (element == '') {
          return
        }

        var tdiv = '<span>' + element + '</span><br>'
  
        const newelement = document.getElementById('usercreatedpostlogs')
        const newdiv = tdiv + newelement.innerHTML
        document.getElementById('usercreatedpostlogs').innerHTML = newdiv
      })
    }

    if (usercommentedlogs.lenght != 0) {
      Array.prototype.forEach.call(usercommentedlogs.split('='), (element) => {
        if (element == '') {
          return
        }

        var tdiv = '<span>' + element + '</span><br>'
  
        const newelement = document.getElementById('usercommentedlogs')
        const newdiv = tdiv + newelement.innerHTML
        document.getElementById('usercommentedlogs').innerHTML = newdiv
      })
    }

    if (iplogs.lenght != 0) {
      Array.prototype.forEach.call(iplogs.split('='), (element) => {
        if (element == '') {
          return
        }

        var tdiv = '<span>' + element + '</span><br>'
  
        const newelement = document.getElementById('iplogs')
        const newdiv = tdiv + newelement.innerHTML
        document.getElementById('iplogs').innerHTML = newdiv
      })
    }

    if (userbanlogs.lenght != 0) {
      Array.prototype.forEach.call(userbanlogs.split('='), (element) => {
        if (element == '') {
          return
        }

        var tdiv = '<span>' + element + '</span><br>'
  
        const newelement = document.getElementById('userbanlogs')
        const newdiv = tdiv + newelement.innerHTML
        document.getElementById('userbanlogs').innerHTML = newdiv
      })
    }

    if (ipbanlogs.lenght != 0) {
      Array.prototype.forEach.call(ipbanlogs.split('='), (element) => {
        if (element == '') {
          return
        }

        var tdiv = '<span>' + element + '</span><br>'
  
        const newelement = document.getElementById('ipbanlogs')
        const newdiv = tdiv + newelement.innerHTML
        document.getElementById('ipbanlogs').innerHTML = newdiv
      })
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function loadindex() {
  if (localStorage.getItem('Username') != null) {
    window.location.href = '/feed'
  } 
}

function logout() {
  localStorage.removeItem('Username')
  localStorage.removeItem('Password')

  window.location.href = '/'
}
