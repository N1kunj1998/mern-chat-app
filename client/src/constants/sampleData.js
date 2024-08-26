export const sampleChats = [
    {
        "avatar": ["https://www.w3schools.com/howto/img_avatar.png"],
        "name": "John Doe",
        "_id": "1",
        "groupChat": false,
        "members": ["1", "2"]
    },
    {
        "avatar": ["https://www.w3schools.com/howto/img_avatar2.png"],
        "name": "Jane Smith",
        "_id": "2",
        "groupChat": false,
        "members": ["1", "3"]
    },
    {
        "avatar": ["https://www.w3schools.com/w3images/avatar2.png"],
        "name": "Alice Johnson",
        "_id": "3",
        "groupChat": false,
        "members": ["1", "4"]
    },
    {
        "avatar": ["https://www.w3schools.com/w3images/avatar6.png"],
        "name": "Bob Brown",
        "_id": "4",
        "groupChat": false,
        "members": ["1", "5"]
    },
    {
        "avatar": ["https://www.w3schools.com/w3images/avatar5.png"],
        "name": "Charlie Davis",
        "_id": "5",
        "groupChat": false,
        "members": ["1", "6"]
    }
];

export const sampleUsers = [
    {
        "avatar": ["https://www.w3schools.com/howto/img_avatar.png"],
        "name": "John Doe",
        "_id": "1",
    },
    {
        "avatar": ["https://www.w3schools.com/howto/img_avatar2.png"],
        "name": "Jane Smith",
        "_id": "2",
    },
    {
        "avatar": ["https://www.w3schools.com/w3images/avatar2.png"],
        "name": "Alice Johnson",
        "_id": "3",
    },
    {
        "avatar": ["https://www.w3schools.com/w3images/avatar6.png"],
        "name": "Bob Brown",
        "_id": "4",
    },
    {
        "avatar": ["https://www.w3schools.com/w3images/avatar5.png"],
        "name": "Charlie Davis",
        "_id": "5",
    }
];

export const sampleNotifcations = [
    {
        sender: {
            "avatar": ["https://www.w3schools.com/howto/img_avatar.png"],
            "name": "John Doe",
        },
        "_id": "1",
    },
    {
        sender: {
            "avatar": ["https://www.w3schools.com/howto/img_avatar2.png"],
            "name": "Jane Smith",
        },
        "_id": "2",
    },
    {
        sender: {
            "avatar": ["https://www.w3schools.com/w3images/avatar2.png"],
            "name": "Alice Johnson",
        },
        "_id": "3",
    },  
] 

export const sampleMessage = [
    {
        attachments: [
            {
                public_id: "asdfafd",
                url: "https://www.w3schools.com/howto/img_avatar.png",
            },
        ],
        content: "someone's message",
        _id: "asdfasdfasdfds",
        sender: {
            _id: "user._id",
            name: "Chaman",
        },
        chat: "chatId",
        createdAt: "2024-02-12T10:41:30.630Z"
    },
    {
        attachments: [
            {
                public_id: "asdfafd",
                url: "https://www.w3schools.com/howto/img_avatar.png",
            },
        ],
        content: "someone's message",
        _id: "asdfasdfasafsdas",
        sender: {
            _id: "asdfasdfa",
            name: "Chaman",
        },
        chat: "chatId",
        createdAt: "2024-02-12T10:41:30.630Z"
    }
];

export const dashboardData = {
    users: [
        {
            "avatar": ["https://www.w3schools.com/howto/img_avatar.png"],
            "name": "John Doe",
            "_id": "1",
            "username": "john_doe",
            "friends": 20,
            "groups": 5
        },
        {
            "avatar": ["https://www.w3schools.com/howto/img_avatar2.png"],
            "name": "Jane Smith",
            "_id": "2",
            "username": "jane_smith",
            "friends": 30,
            "groups": 7
        },
        {
            "avatar": ["https://www.w3schools.com/w3images/avatar2.png"],
            "name": "Alice Johnson",
            "_id": "3",
            "username": "alice_johnson",
            "friends": 12,
            "groups": 2
        },
    ],

    chats: [
        {
            "name": "John Doe",
            "avatar": ["https://www.w3schools.com/howto/img_avatar.png"],
            "_id": "1",
            "groupChat": false,
            "members": [{_id: "1", avatar: "https://www.w3schools.com/howto/img_avatar.png"}, {_id: "2", avatar: "https://www.w3schools.com/howto/img_avatar.png"}],
            "totalMembers": 2,
            "totalMessages": 20,
            "creator": {
                "name": "John Doe",
                "avatar": "https://www.w3schools.com/howto/img_avatar.png",
            },
        },
        {
            "name": "Jane Smith",
            "avatar": ["https://www.w3schools.com/howto/img_avatar2.png"],
            "_id": "2",
            "groupChat": false,
            "members": [{_id: "1", avatar: "https://www.w3schools.com/howto/img_avatar.png"}, {_id: "2", avatar: "https://www.w3schools.com/howto/img_avatar.png"}],
            "totalMembers": 2,
            "totalMessages": 15,
            "creator": {
                "name": "Jane Smith",
                "avatar": "https://www.w3schools.com/howto/img_avatar2.png"
            }
        },
        {
            "name": "Alice Johnson",
            "avatar": ["https://www.w3schools.com/w3images/avatar2.png"],
            "_id": "3",
            "groupChat": false,
            "members": [{_id: "1", avatar: "https://www.w3schools.com/howto/img_avatar.png"}, {_id: "2", avatar: "https://www.w3schools.com/howto/img_avatar.png"}],
            "totalMembers": 2,
            "totalMessages": 30,
            "creator": {
                "name": "Alice Johnson",
                "avatar": "https://www.w3schools.com/w3images/avatar2.png"
            }
        },
    ],

    messages: [
        {
            attachments:[],
            content: "someone's message",
            _id: "dsfafasdf",
            groupChat: false,
            sender: {
                _id: "user._id",
                name: "JohnDoe",
                avatar: "https://www.w3schools.com/howto/img_avatar.png",
            },
            chat: "chatId",
            createdAt: "2024-02-12T10:41:30.630z"
        },
        {
            attachments:[
                {
                    public_id: "adfafsd",
                    url: "https://www.w3schools.com/howto/img_avatar.png"
                }
            ],
            content: "someone'asdasdfasdfs message",
            _id: "dsfafaadsfasdf",
            groupChat: true,
            sender: {
                _id: "user._id",
                name: "JohnDoe",
                avatar: "https://www.w3schools.com/howto/img_avatar.png"
            },
            chat: "chatId",
            createdAt: "2024-02-12T10:41:30.630z"
        },
    ]
}