firebase 와 nextron 을 이용한 채팅 앱입니다.

# 레파지토리를 받으셨다면 받은 내용 내부에서 반드시 최초 한번 CLI 에 아래 코드를 입력하여 서버가 실행 될 수 있도록 설치해주세요.

```
# using yarn or npm
yarn 을 입력하시거나 npm install 을 입력해주시면 됩니다.
$ yarn (or `npm install`)
```

# 위의 명령어를 입력하여 설치가 완료된 후에는 아래의 코드를 입력하여 서버를 실행 시켜 주세요.
```
yarn dev 또는 npm run dev 를 입력해주시면 됩니다.
$ yarn dev (or npm run dev)
```

아래는 실제로 앱에 구현된 기능들 입니다.

![로그인](https://user-images.githubusercontent.com/53066347/216399968-852a4e59-861a-43fb-83ee-5de87f0b2cf0.png)

로그인을 위한 화면입니다. ID 는 email 이며 현재는 이메일 형식만 갖추어서 입력하실 수 있도록 되어 있습니다.

![회원가입](https://user-images.githubusercontent.com/53066347/216399986-74ce4e28-454d-418c-9545-314697bcb010.png)

회원가입을 위한 화면입니다. 핸드폰번호는 '-' 없이 '010' 부터 입력해주시면 됩니다. email 과 마찬가지로 형식만 갖추어서 입력하실 수 있도록 되어 있습니다.

## 로그인과 회원가입은 현재 firebase admin 에서 관리되고 있습니다. 중복되거나 형식이 맞지 않으면 회원가입이 되지 않습니다.

![메인화면](https://user-images.githubusercontent.com/53066347/216400015-07d65c17-f3e3-43fb-908a-647347e45dd6.png)

좌측 상단의 메뉴바와 우측 상단의 뒤로가기, 로그아웃 그리고 현재 로그인한 사용자의 정보가 있습니다. 또한 화면 중앙에는 앱의 사용법에 대해 간략하게 정리해두었습니다.

![사용자목록화면](https://user-images.githubusercontent.com/53066347/216400799-508e9dad-d737-48c6-be61-78477a414e81.png)

회원가입된 사용자들의 정보를 보여주는 화면입니다. 사용자들을 채팅방으로 초대하여 대화를 할 수도 있습니다. '그룹 채팅'과 '1:1 채팅'을 고를 수 있으며 그룹 채팅 시에는 반드시 2명 이상 초대해야 합니다. 또한 자기 자신은 초대할 수 없습니다. 자신의 정보를 담은 로우는 아이콘으로 표현되어 있습니다.

![사용자목록화면2](https://user-images.githubusercontent.com/53066347/216401256-7d34f1d9-b943-4daa-bd7b-a88ee24e9bfe.png)

그룹 채팅일 경우 반드시 사용자를 두명 이상 지정해야만 초대 버튼이 활성화 됩니다.

![사용자목록화면3](https://user-images.githubusercontent.com/53066347/216401441-de2b4949-e460-4954-9b6f-d0a015e0c04d.png)

1:1 채팅의 경우 스위치 버튼 대신 초대 버튼으로 표시되며 클릭시 바로 초대할 수 있습니다.

![사용자목록화면4](https://user-images.githubusercontent.com/53066347/216401619-53e10237-aac6-4f44-b3a7-b4c93e6ec196.png)

초대 버튼 클릭시에 나오는 모달 창입니다. 방 제목을 입력하고 'OK' 버튼을 클릭하면 방이 생성되고 사용자를 초대합니다.

![사용자목록화면5](https://user-images.githubusercontent.com/53066347/216401765-c9ddd81d-200a-423d-9a25-22a74145787c.png)

방을 생성하거나 누군가가 당신을 초대한다면 좌측 하단에 방 제목과 함께 알람이 뜹니다. 알람을 클릭시에 해당 방으로 바로 입장합니다.

![참여중인방목록](https://user-images.githubusercontent.com/53066347/216401978-803620a4-b42c-4331-b863-ca172828b8b1.png)

현재 참여중인 방 목록을 보여줍니다. 참여중인 방 제목, 생성일자, 마지막 메세지 그리고 참여자를 볼 수 있습니다. 방에 입장하거나 방을 나갈 수도 있습니다. 또한 생성된지 5분이 되지 않은 방은 'New' 아이콘과 함께 초록색 방으로 나타납니다.

![오픈채팅방목록화면](https://user-images.githubusercontent.com/53066347/216402413-01c442be-06d8-4a3d-a54f-a16c21f12c49.png)

오픈 채팅방 목록 화면입니다. 오픈 채팅방은 테마별 방으로써 사용자 모두가 자유롭게 이용가능한 방입니다. 실시간으로 정보를 불러옵니다. 누군가 채팅방에서 채팅중이라면 최근 메세지를 통해서 확인 가능합니다.

![채팅방1](https://user-images.githubusercontent.com/53066347/216402635-c4a9619b-2ee5-46a7-a788-cc8d93958265.png)

상단에는 채팅방의 제목과 참여자가 나옵니다. 오픈 채팅방일 경우 모든 사용자가 참여자이기에 참여자가 나오지않습니다. 또한 메세지를 전송한 날짜와 시간을 확인할 수 있으며 상대의 메세지는 좌측에 나의 메세지는 우측에 표현됩니다. 하단에는 메세지 보내기 버튼과 목록으로 돌아가기 버튼이 있습니다. 오픈 채팅방은 따로 나가기 기능이 없습니다.

![채팅방2](https://user-images.githubusercontent.com/53066347/216403120-c59cc2db-323c-4b32-8167-c06eb8170d57.png)

오픈 채팅방 이외의 채팅방에서는 채팅방 제목과 함계 참여자를 확인 가능하며 하단에 방에서 나가기 버튼이 생겨 방에서 나가실 수 있습니다.
나간 방은 참여중인 채팅방이 아니기에 더이상 채팅방 목록에서 보이지 않습니다.
