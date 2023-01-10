const accountController = require('../controllers/account.controller')
const express = require('express')
const router = express.Router()

// route: /api/account/
router.route('/')
    .get(accountController.findAll)
    .post(accountController.create)

// route: /api/account/:id
router.route('/:id')
    .get(accountController.getById)
    .patch(accountController.update)
    .delete(accountController.delete)

// route: /api/account/:id/suggest
router.route('/:id/suggest')
    .get(async (req, res, next) => {

        /* 
            Ý tưởng: danh sách gợi ý được xây dựng bằng cách, tìm ra danh sách bạn bè
                     của user, sau đó lại tìm danh sách bạn bè của bạn bè. Danh sách đó là
                     danh sách gợi ý

            Các bước thực hiện:
            - Lấy ra danh sách bạn bè của user: truy vấn csdl
                => nếu danh sách có phần tử thì chuyển sang bước (*)
                => nếu danh sách không có phần tử nào thì chuyển sang bước (**)
                
            - (*) Trường hợp có bạn bè: Lây ra danh sách bạn bè của bạn bè 
                                        --> danh sách vừa tìm là kết quả
                +) danh sách vừa tìm không có phần tử nào (chưa xử lí)
                +) danh sách vừa tìm có phần tử ==> kết luận
            - (**) Trường hợp chưa từng kết bạn: chọn ra 12 tài khoản != user
        */

        const FriendService = require('../services/friend.service')
        const friendService = new FriendService()
        const Friend = friendService.Friend

        const userId = req.params.id
        const getFriendsId = function (dataArrray, id) {
            const friends = []
            dataArrray.forEach(({ accountId1, accountId2 }) => {
                if (accountId1 == id) {
                    friends.push(accountId2)
                }
                else {
                    friends.push(accountId1)
                }
            })
            return friends
        }

        // data = [ friendObject ] = [ {accountId1, accountId2}, {}, {}...]
        const data = await friendService.getByAccountId(userId, true)
        const result = []

        if (data.length == 0) {
            const AccountService = require('../services/account.service')
            const accountService = new AccountService()
            const { ObjectId } = require('mongodb')

            const data2 = await accountService.Account.find({
                _id: {
                    $ne: ObjectId(userId)
                }
            }).limit(12).toArray()

            data2.forEach(acc => {
                result.push(acc._id)
            })
        }
        else {
            const friendsOfUser = getFriendsId(data, userId)
            const set = new Set(friendsOfUser)

            const data2 = await Friend.find({
                $or: [
                    { accountId1: { $in: friendsOfUser } },
                    { accountId2: { $in: friendsOfUser } }
                ],
                isAccept: true
            }).toArray()

            data2.forEach(({ accountId1, accountId2 }) => {
                if (accountId1 == userId || accountId2 == userId) return

                if (set.has(accountId1)) {
                    if (!set.has(accountId2)) {
                        result.push(accountId2)
                    }
                }
                else {
                    if (!set.has(accountId1)) {
                        result.push(accountId1)
                    }
                }
            })
        }

        console.log('>> suggest accounts')
        res.send(result)

    })

// route: /api/account/text/:text
router.route('/text/:text')
    .get(accountController.findByNameOrId)

// route: /api/account/usr/:username/pwrd/:password
router.route('/usr/:username/pwrd/:password')
    .get(accountController.findByUsernameAndPassword)


module.exports = router