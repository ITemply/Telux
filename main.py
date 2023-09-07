from flask import Flask, request, render_template, redirect, abort
from flask_cors import CORS
from datetime import date

import string, random, os, re, datetime, shutil, time

app = Flask(__name__)
cors = CORS(app, resources={r"/": {"origins": "https://web.telux.repl.co"}})

global AdminKey
AdminKey = os.environ['AdminKey']

@app.before_request
def block_method():
  ip = request.headers.get('X-Forwarded-For')
  with open('logs/iplogs/ipbans/bans.txt', 'r') as banfile:
    ip_ban_list = banfile.readlines()
    if ip in ip_ban_list:
        return render_template('ipbanned.html')

def generatepostid():
  datetime_object = datetime.datetime.now()
  seconds_since_epoch = datetime_object.timestamp()
  return seconds_since_epoch

def generateid(length):
  characters = string.digits
  random_string = ''.join(random.choice(characters) for _ in range(length))
  return random_string

def cleantext(text):
  outputString = re.sub('<[^<]+?>', "", text)
  return outputString

@app.route('/', methods=['GET'])
def index():
  return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
  if request.method == 'POST':
    data = request.get_json(force=True)
    username = data['username']
    password = data['password']

    for file in os.listdir('accounts'):
      if file == username:
        with open('accounts/' + username + '/' + 'info.txt', 'r') as infofile:
          lines = infofile.readlines()
          infousername = lines[0].split('\n')
          infopassword = lines[1].split('\n')

          if username == 'Admin':
            if password == AdminKey:
              return '{"status": "Login Success"}'
            else:
              return '{"status": "Login Error"}'
          elif username == infousername[0]:
            if password == infopassword[0]:
              return '{"status": "Login Success"}'
            else:
              return '{"status": "Login Error"}'
          else:
            return '{"status": "Login Error"}'
  else:
    return render_template('login.html')

@app.route('/createaccount', methods=['GET', 'POST'])
def createaccount():
  if request.method == 'POST':
    data = request.get_json(force=True)
    username = data['username']
    password = data['password']

    for file in os.listdir('accounts'):
      if file.lower() == username.lower():
        return '{"status": "Username Taken"}'

    with open('logs/accountlogs/bannedusernames.txt', 'r') as banusers:
      bannedusernames = banusers.readlines()
      for i in range(len(bannedusernames)):
        if username.lower() in bannedusernames[i].lower():
          return '{"status": "Username Taken"}'

    uid = generateid(10)

    os.mkdir('accounts/' + username)
    os.mkdir('accounts/' + username + '/profile')
    os.mkdir('accounts/' + username + '/posts')
    with open('accounts/' + username + '/' + 'info.txt', 'a') as infofile:
      infofile.write(username + '\n' + password + '\n' + uid)

    os.mkdir('static/accounts/' + username)
    os.mkdir('static/accounts/' + username + '/filestorage')
    os.mkdir('static/accounts/' + username + '/filestorage/profileimages')
    os.mkdir('static/accounts/' + username + '/filestorage/postimages')

    shutil.copyfile('static/images/pfp.png', 'static/accounts/' + username + '/filestorage/profileimages/pfp.png')
    shutil.copyfile('static/images/banner.png', 'static/accounts/' + username + '/filestorage/profileimages/banner.png')

    today = date.today()
    with open('accounts/' + username + '/profile/info.txt', 'a') as infofile:
      infofile.write(
          username + '\nMy Amazing Description\nMy Amazing Title\n' + str(today) + '\n' + uid + '\n\nstatic/accounts/' + username + '/filestorage/profileimages/pfp.png\nstatic/accounts/' + username + '/filestorage/profileimages/banner.png')
    return '{"status": "Account Created"}'
  else:
    return render_template('createaccount.html')

@app.route('/profile', methods=['GET', 'POST'])
def profile():
  if request.method == 'POST':
    data = request.get_json(force=True)
    username = data['username']

    for file in os.listdir('accounts'):
      if file == username:
        information = ''
        with open('accounts/' + username + '/profile/info.txt', 'r') as infofile:
          lines = infofile.readlines()
          infousername = lines[0].split('\n')
          description = lines[1].split('\n')
          title = lines[2].split('\n')
          joindate = lines[3].split('\n')
          pfp = lines[6].split('\n')
          banner = lines[7].split('\n')

          information = infousername[0] + '=' + description[0] + '=' + title[
              0] + '=' + joindate[0] + '=' + pfp[0] + '=' + banner[0]

        return '{"information": "' + information + '"}'
    return '{"information": "Profile Not Found"}'
  else:
    return render_template('profile.html')

@app.route('/checkuser', methods=['POST'])
def checkuser():
  if request.method == 'POST':
    data = request.get_json(force=True)
    username = data['username']
    password = data['password']

    for file in os.listdir('accounts'):
      if file == username:
        with open('accounts/' + username + '/' + 'info.txt', 'r') as infofile:
          lines = infofile.readlines()
          infousername = lines[0].split('\n')
          infopassword = lines[1].split('\n')

          if username == 'Admin':
            if password == AdminKey:
              return '{"status": "Login Success"}'
            else:
              return '{"status": "Login Error"}'
          elif username == infousername[0]:
            if password == infopassword[0]:
              return '{"status": "Login Success"}'
            else:
              return '{"status": "Login Error"}'
          else:
            return '{"status": "Login Error"}'
    return '{"status": "Check Error"}'

@app.route('/changeprofile', methods=['POST'])
def changeprofile():
  if request.method == 'POST':
    data = request.form
    description = data.get('description')
    title = data.get('title')
    sendingpfp = data.get('sendingpfp')
    sendingbanner = data.get('sendingbanner')
    username = data.get('username')
    password = data.get('password')
    
    for file in os.listdir('accounts'):
      if file == username:
        with open('accounts/' + str(username) + '/' + 'info.txt', 'r') as infofile:
          lines = infofile.readlines()
          infousername = lines[0].split('\n')
          infopassword = lines[1].split('\n')

          if username == infousername[0]:
            if password == infopassword[0]:
              if description:
                with open('accounts/' + str(username) + '/profile/info.txt', 'r') as infofile1:
                  lines = infofile1.readlines()
                  lines[1] = cleantext(description) + '\n'

                  with open('accounts/' + str(username) + '/profile/info.txt', 'w') as infofile2:
                    infofile2.writelines(lines)
              
              if title:
                with open('accounts/' + str(username) + '/profile/info.txt', 'r') as infofile1:
                  lines = infofile1.readlines()
                  lines[2] = cleantext(title) + '\n'

                  with open('accounts/' + str(username) + '/profile/info.txt', 'w') as infofile2:
                    infofile2.writelines(lines)

              if sendingpfp == 'true':
                pfp = request.files['pfp']
                pfpfilename = pfp.filename
                extensionpfp = pfpfilename.split('.')
                pfp.save('static/accounts/' + str(username) + '/filestorage/profileimages/pfp.' + extensionpfp[-1])
                with open('accounts/' + str(username) + '/profile/info.txt', 'r') as infofile1:
                  lines = infofile1.readlines()
                  lines[6] = 'static/accounts/' + str(username) + '/filestorage/profileimages/pfp.' + extensionpfp[-1] + '\n'

                  with open('accounts/' + str(username) + '/profile/info.txt', 'w') as infofile2:
                    infofile2.writelines(lines)

              if sendingbanner == 'true':
                banner = request.files['banner']
                bannerfilename = banner.filename
                extensionbanner = bannerfilename.split('.')
                banner.save('static/accounts/' + str(username) + '/filestorage/profileimages/banner.' + extensionbanner[-1])
                with open('accounts/' + str(username) + '/profile/info.txt', 'r') as infofile1:
                  lines = infofile1.readlines()
                  lines[7] = 'static/accounts/' + str(username) + '/filestorage/profileimages/banner.' + extensionbanner[-1] + '\n'

                  with open('accounts/' + str(username) + '/profile/info.txt', 'w') as infofile2:
                    infofile2.writelines(lines)

              return 'Changed'
            else:
              return 'Invalid Password'
          else:
            return 'Invalid Username'

@app.route('/getpostsuser', methods=['POST'])
def getpostsuser():
  if request.method == 'POST':
    data = request.get_json(force=True)
    username = data['username']

    global sendingstr
    sendingstr = ''

    count = 0
    
    for file in os.listdir('accounts/' + username + '/posts'):
      count = count + 1
      with open('accounts/' + username + '/posts/' + file + '/post-' + file + '.txt', 'r') as postfile:
        lines = postfile.readlines()
        user = lines[0].split('\n')
        pfp = lines[1].split('\n')
        text = lines[2].split('\n')
        postid = lines[3].split('\n')
        postdate= lines[4].split('\n')
        posttype = lines[5].split('\n')
        
        global media
        media = None

        if posttype[0] == 'posttype/m':
          media = lines[6].split('\n')
          sendingstr = sendingstr + user[0] + '=' + pfp[0] + '=' + text[0] + '=' + postid[0] + '=' + postdate[0] + '=' + posttype[0] + '=' + media[0] + '|'
        else:
          sendingstr = sendingstr + user[0] + '=' + pfp[0] + '=' + text[0] + '=' + postid[0] + '=' + postdate[0] + '=' + posttype[0] + '|'

    if count == 0:
      return '{"information": "No Posts"}'
    else:
      return '{"information": "' + sendingstr + '"}'

@app.route('/sendpost', methods=['POST'])
def sendpost():
  if request.method == 'POST':
    data = request.form
    posttext = data.get('posttext')
    sendingpfp = data.get('sendingpfp')
    username = data.get('username')
    password = data.get('password')

    with open('accounts/' + str(username) + '/' + 'info.txt', 'r') as infofile:
      lines = infofile.readlines()
      infousername = lines[0].split('\n')
      infopassword = lines[1].split('\n')

      id = round(generatepostid())

      if username == infousername[0]:
        if password == infopassword[0]:
          if posttext:
            os.mkdir('accounts/' + str(username) + '/posts/' + str(id))
            cleanedtext = cleantext(posttext)
            splitcleanedtext = cleanedtext.split()
            tags = []
            for i in range(len(splitcleanedtext)):
              if '#' in splitcleanedtext[i]:
                tags.append(splitcleanedtext[i])
                splitcleanedtext[i] = '<b>' + splitcleanedtext[i] + '</b>'    
            textstr = ''
            for i in range(len(splitcleanedtext)):
              textstr = textstr + splitcleanedtext[i] + ' '

            today = date.today()
            pfp = ''
            for file in os.listdir('static/accounts/' + str(username) + '/filestorage/profileimages'):
              if 'pfp' in file:
                pfp = 'static/accounts/' + str(username) + '/filestorage/profileimages/' + file
                
            tagsstr = ''
            for i in range(len(tags)):
              tagsstr = tagsstr + tags[i]

            os.mkdir('accounts/' + str(username) + '/posts/' + str(id) + '/comments')

            if sendingpfp == 'false':
              with open('accounts/' + str(username) + '/posts/' + str(id) + '/post-' + str(id) + '.txt', 'w') as postfile:
                postfile.write(str(username) + '\n' + pfp + '\n' + textstr + '\n' + str(id) + '\n' + str(today) + '\nposttype/t\n\n' + ' ' +tagsstr)
            elif sendingpfp == 'true':
              with open('accounts/' + str(username) + '/posts/' + str(id) + '/post-' + str(id) + '.txt', 'w') as postfile:
                image = request.files['media']
                filename = image.filename
                extension = filename.split('.')

                os.mkdir('static/accounts/' + str(username) + '/filestorage/postimages/' + str(id))
                image.save('static/accounts/' + str(username) + '/filestorage/postimages/' + str(id) + '/' + str(id) + '-image.' + extension[-1])
                postfile.write(str(username) + '\n' + pfp + '\n' + textstr + '\n' + str(id) + '\n' + str(today) + '\nposttype/m\n' + 'static/accounts/' + str(username) + '/filestorage/postimages/' + str(id) + '/' + str(id) + '-image.' + extension[-1] + '\n' + ' ' + tagsstr)
            return 'Posted'

@app.route('/feed', methods=['GET', 'POST'])
def feed():
  if request.method == 'POST':
    global sendingstr
    sendingstr = ''

    count = 0
    
    for username in os.listdir('accounts'):
      for file in os.listdir('accounts/' + username + '/posts'):
        if count <= 500:
          count = count + 1
          with open('accounts/' + username + '/posts/' + file + '/post-' + file + '.txt', 'r') as postfile:
            lines = postfile.readlines()
            user = lines[0].split('\n')
            pfp = lines[1].split('\n')
            text = lines[2].split('\n')
            postid = lines[3].split('\n')
            postdate= lines[4].split('\n')
            posttype = lines[5].split('\n')
        
            global media
            media = None

            if posttype[0] == 'posttype/m':
              media = lines[6].split('\n')
              sendingstr = sendingstr + user[0] + '=' + pfp[0] + '=' + text[0] + '=' + postid[0] + '=' + postdate[0] + '=' + posttype[0] + '=' + media[0] + '|'
            else:
              sendingstr = sendingstr + user[0] + '=' + pfp[0] + '=' + text[0] + '=' + postid[0] + '=' + postdate[0] + '=' + posttype[0] + '|'

    if count == 0:
      return '{"information": "No Posts"}'
    else:
      return '{"information": "' + sendingstr + '"}'
  else:
    return render_template('feed.html')

@app.route('/post', methods=['GET', 'POST'])
def post():
  if request.method == 'POST':
    data = request.get_json(force=True)
    postid = data['postid']
    
    global sendingstr
    sendingstr = ''
    
    for username in os.listdir('accounts'):
      for file in os.listdir('accounts/' + username + '/posts'):
        if file == postid:
          with open('accounts/' + username + '/posts/' + file + '/post-' + file + '.txt', 'r') as postfile:
            lines = postfile.readlines()
            user = lines[0].split('\n')
            pfp = lines[1].split('\n')
            text = lines[2].split('\n')
            npostid = lines[3].split('\n')
            postdate= lines[4].split('\n')
            posttype = lines[5].split('\n')
        
            global media
            media = None

            if posttype[0] == 'posttype/m':
              media = lines[6].split('\n')
              sendingstr = sendingstr + user[0] + '=' + pfp[0] + '=' + text[0] + '=' + npostid[0] + '=' + postdate[0] + '=' + posttype[0] + '=' + media[0] + '|'
            else:
              sendingstr = sendingstr + user[0] + '=' + pfp[0] + '=' + text[0] + '=' + npostid[0] + '=' + postdate[0] + '=' + posttype[0] + '|'
    else:
      return '{"information": "' + sendingstr + '"}'
  else:
    return render_template('post.html')

@app.route('/getcomments', methods=['POST'])
def getcomments():
  if request.method == 'POST':
    data = request.get_json(force=True)
    postid1 = data['postid']

    global sendingstr1
    sendingstr1 = ''

    count = 0
    
    for username in os.listdir('accounts'):
      for postsfile in os.listdir('accounts/' + username + '/posts'):
        if str(postsfile) == str(postid1):
          if os.listdir('accounts/' + username + '/posts/' + postsfile + '/comments'):
            for file1 in os.listdir('accounts/' + username + '/posts/' + postsfile + '/comments'):
              if 'comment-' in file1:
                with open('accounts/' + username + '/posts/' + postsfile + '/comments/' + file1, 'r') as commentfile:
                  count = count + 1
                  lines = commentfile.readlines()
                  user = lines[0].split('\n')
                  pfp = lines[1].split('\n')
                  text = lines[2].split('\n')
                  epostid = lines[3].split('\n')
                  postdate= lines[4].split('\n')
          
                  sendingstr1 = sendingstr1 + user[0] + '=' + pfp[0] + '=' + text[0] + '=' + epostid[0] + '=' + postdate[0] + '|'

    if count == 0:
      return '{"information": "No Comments"}'
    else:
      return '{"information": "' + sendingstr1 + '"}'

@app.route('/sendcomment', methods=['POST'])
def sendcomment():
  if request.method == 'POST':
    data = request.form
    commenttext = data.get('commenttext')
    username = data.get('username')
    password = data.get('password')
    id = data.get('id')

    with open('accounts/' + str(username) + '/' + 'info.txt', 'r') as infofile:
      lines = infofile.readlines()
      infousername = lines[0].split('\n')
      infopassword = lines[1].split('\n')

      nid = round(generatepostid())

      if username == infousername[0]:
        if password == infopassword[0]:
          if commenttext:
            cleanedtext = cleantext(commenttext)
           
            today = date.today()
            pfp = ''
            for file in os.listdir('static/accounts/' + str(username) + '/filestorage/profileimages'):
              if 'pfp' in file:
                pfp = 'static/accounts/' + str(username) + '/filestorage/profileimages/' + file
            for account in os.listdir('accounts'):
              for posts in os.listdir('accounts/' + account + '/posts'):
                if str(posts) == str(id):
                  with open('accounts/' + account + '/posts/' + posts + '/comments/comment-' + str(nid) + '.txt', 'a') as commentfile:
                    commentfile.write(str(username) + '\n' + pfp + '\n' + cleanedtext + '\n' + str(nid) + '\n' + str(today))

          return 'Posted'

@app.route('/search', methods=['GET', 'POST'])
def search():
  if request.method == 'POST':
    data = request.get_json(force=True)
    searchq = data['query']

    global sendingstr1
    sendingstr2 = ''

    count = 0
    
    for username in os.listdir('accounts'):
      for postsfile in os.listdir('accounts/' + username + '/posts'):
        for file in os.listdir('accounts/' + username + '/posts/' + postsfile):
          if 'post-' in file:
            with open('accounts/' + username + '/posts/' + postsfile + '/' + file, 'r') as postfile:
              lines = postfile.readlines()
              tags = lines[-1].split('\n')
              if tags[0] != ' ':
                formattedtags = searchq.split(' ')
                if all(x in tags[0] for x in formattedtags):
                  count = count + 1
                  user = lines[0].split('\n')
                  pfp = lines[1].split('\n')
                  text = lines[2].split('\n')
                  postid = lines[3].split('\n')
                  postdate= lines[4].split('\n')
                  posttype = lines[5].split('\n')
        
                  global media
                  media = None

                  if posttype[0] == 'posttype/m':
                    media = lines[6].split('\n')
                    sendingstr2 = sendingstr2 + user[0] + '=' + pfp[0] + '=' + text[0] + '=' + postid[0] + '=' + postdate[0] + '=' + posttype[0] + '=' + media[0] + '|'
                  else:
                    sendingstr2 = sendingstr2 + user[0] + '=' + pfp[0] + '=' + text[0] + '=' + postid[0] + '=' + postdate[0] + '=' + posttype[0] + '|'

    if count == 0:
      return '{"information": "No Posts"}'
    else:
      return '{"information": "' + sendingstr2 + '"}'

    if count == 0:
      return '{"information": "No Posts"}'
    else:
      return '{"information": "' + sendingstr1 + '"}'
  else:
    return render_template('search.html')

@app.route('/log', methods=['POST'])
def log():
  if request.method == 'POST':
    data = request.get_json(force=True)
    datatype = data['datatype']
    collectdata = data['collectdata']

    currenttime = time.ctime(time.time())

    if datatype == 'Type/AC':
      with open('logs/accountlogs/accountcreationlog.txt', 'a') as logfile:
        logfile.write('(Account Created) Username: <b>' + collectdata + '</b> Time: ' + currenttime + '\n')
    elif datatype == 'Type/AL':
      with open('logs/accountlogs/accountlogin.txt', 'a') as logfile:
        logfile.write('(Account Logged In) Username: <b>' + collectdata + '</b> Time: ' + currenttime + '\n')
    elif datatype == 'Type/UP':
      with open('logs/accountlogs/profileupdated.txt', 'a') as logfile:
        logfile.write('(Profile Updated) ' + collectdata + ' Time: ' + currenttime + '\n')
    elif datatype == 'Type/SE':
      with open('logs/searchlogs/searches.txt', 'a') as logfile:
        logfile.write('(User Searched) ' + collectdata + ' Time: ' + currenttime + '\n')
    elif datatype == 'Type/PC':
      with open('logs/postlogs/posts/post.txt', 'a') as logfile:
        logfile.write('(User Created Post) ' + collectdata + ' Time: ' + currenttime + '\n')
    elif datatype == 'Type/CC':
      with open('logs/postlogs/comments/comment.txt', 'a') as logfile:
        logfile.write('(User Created Comment) ' + collectdata + ' Time: ' + currenttime + '\n')
    elif datatype == 'Type/IPL':
      with open('logs/iplogs/iplog/ips.txt', 'a') as logfile:
        logfile.write('(IP Log) ' + collectdata + ' Time: ' + currenttime + '\n')

    return 'Logged Data'

@app.route('/logs', methods=['GET', 'POST'])
def logs():
  if request.method == 'POST':
    data = request.get_json(force=True)
    username = data['username']
    password = data['password']

    if username == 'Admin':
      if password == AdminKey:
        global logdata
        logdata = ''
        with open('logs/accountlogs/accountcreationlog.txt', 'r') as logfile:
          lines = logfile.readlines()
          for i in range(len(lines)):
            line = lines[i].split('\n')
            logdata = logdata + line[0] + '='
          logdata = logdata + '|'
          
        with open('logs/accountlogs/accountlogin.txt', 'r') as logfile:
          lines = logfile.readlines()
          for i in range(len(lines)):
            line = lines[i].split('\n')
            logdata = logdata + line[0] + '='
          logdata = logdata + '|'
          
        with open('logs/accountlogs/profileupdated.txt', 'r') as logfile:
          lines = logfile.readlines()
          for i in range(len(lines)):
            line = lines[i].split('\n')
            logdata = logdata + line[0] + '='
          logdata = logdata + '|'
          
        with open('logs/searchlogs/searches.txt', 'r') as logfile:
          lines = logfile.readlines()
          for i in range(len(lines)):
            line = lines[i].split('\n')
            logdata = logdata + line[0] + '='
          logdata = logdata + '|'
          
        with open('logs/postlogs/posts/post.txt', 'r') as logfile:
          lines = logfile.readlines()
          for i in range(len(lines)):
            line = lines[i].split('\n')
            logdata = logdata + line[0] + '='
          logdata = logdata + '|'
          
        with open('logs/postlogs/comments/comment.txt', 'r') as logfile:
          lines = logfile.readlines()
          for i in range(len(lines)):
            line = lines[i].split('\n')
            logdata = logdata + line[0] + '='
          logdata = logdata + '|'
          
        with open('logs/iplogs/iplog/ips.txt', 'r') as logfile:
          lines = logfile.readlines()
          for i in range(len(lines)):
            line = lines[i].split('\n')
            logdata = logdata + line[0] + '='
          logdata = logdata + '|'
          
        with open('logs/iplogs/ipbans/bans.txt', 'r') as logfile:
          lines = logfile.readlines()
          for i in range(len(lines)):
            line = lines[i].split('\n')
            logdata = logdata + line[0] + '='
          logdata = logdata + '|'

        with open('logs/accountlogs/bannedusernames.txt', 'r') as logfile:
          lines = logfile.readlines()
          for i in range(len(lines)):
            line = lines[i].split('\n')
            logdata = logdata + line[0] + '='
          logdata = logdata + '|'
          
        return '{"information": "' + logdata + '"}'
      else:
        return '{"information": "No Access"}'
    else:
      return '{"information": "No Access"}'
  else:
    return render_template('logs.html')

@app.route('/panel', methods=['GET', 'POST'])
def panel():
  if request.method == 'POST':
    data = request.get_json(force=True)
    username = data['username']
    password = data['password']

    if username == 'Admin':
      if password == AdminKey:
        return '{"information": "Granted"}'
      else:
        return '{"information": "No Access"}'
    else:
      return '{"information": "No Access"}'
  else:
    return render_template('panel.html')

@app.route('/sendcommand', methods=['POST'])
def sendcommand():
  if request.method == 'POST':
    data = request.get_json(force=True)
    username = data['username']
    password = data['password']
    command = data['command']
    exdata = data['exdata']

    if username == 'Admin':
      if password == AdminKey:
        if command == 'CType/UBAN':
          user = str(exdata)
          if user == 'Admin':
            return
          for file in os.listdir('accounts'):
            if file == user:
              shutil.rmtree('accounts/' + file)
          for file in os.listdir('static/accounts'):
            if file == user:
              shutil.rmtree('static/accounts/' + file)
          with open('logs/accountlogs/bannedusernames.txt', 'a') as banuserfile:
            banuserfile.write(user + '\n')
          return '{"information": "Success"}'
        elif command == 'CType/IPBAN':
          ip = str(exdata)
          with open('logs/iplogs/ipbans/bans.txt', 'a') as banuserfile:
            banuserfile.write(ip + '\n')
          return '{"information": "Success"}'
        elif command == 'CType/UNIPBAN':
          ip = str(exdata)
          with open('logs/iplogs/ipbans/bans.txt', 'r') as banuserfile:
            bannedips = banuserfile.readlines()
            for i in range(len(bannedips)):
              if ip in bannedips[i]:
                bannedips[i] = ''
                with open('logs/iplogs/ipbans/bans.txt', 'w') as unbanfile:
                  unbanfile.writelines(bannedips)
                  return '{"information": "Success"}'
        elif command == 'CType/UNBAN':
          user = str(exdata)
          with open('logs/accountlogs/bannedusernames.txt', 'r') as banuserfile:
            bannedusers = banuserfile.readlines()
            for i in range(len(bannedusers)):
              if user in bannedusers[i]:
                bannedusers[i] = ''
                with open('logs/accountlogs/bannedusernames.txt', 'w') as unbanfile:
                  unbanfile.writelines(bannedusers)
                  return '{"information": "Success"}'
        elif command == 'CType/DELPOST':
          id = str(exdata)
          if id == '1693509859':
            return
          for username in os.listdir('accounts'):
            for postsfile in os.listdir('accounts/' + username + '/posts'):
              if id in postsfile:
                shutil.rmtree('accounts/' + username + '/posts/' + postsfile)
                return '{"information": "Success"}'
        elif command == 'CType/DELCOM':
          id = str(exdata)
          for username in os.listdir('accounts'):
            for postsfile in os.listdir('accounts/' + username + '/posts'):
              for file1 in os.listdir('accounts/' + username + '/posts/' + postsfile + '/comments'):
                if id in file1:
                  os.remove('accounts/' + username + '/posts/' + postsfile + '/comments/' + file1)
                  return '{"information": "Success"}'
      else:
        return '{"information": "No Access"}'
    else:
      return '{"information": "No Access"}'

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=8080)