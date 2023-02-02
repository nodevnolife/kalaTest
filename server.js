const express = require('express');
const server = express();
const port = 8000;
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken')
const passport = require('passport')
const auth = passport.authenticate('jwt', { session: false })
const { config } = require('./auth/index')
server.use(express.json());

//login user

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await prisma.users.findUnique({
        where: {
            username: username
        }
    })
    if (user) {
        if (user.password === password) {
            const token = jwt.sign({ username: user.username }, config.passport.secret, { expiresIn: config.passport.expiresIn })
            res.status(200).json({
                username: user.username,
                token: token
            })
        } else {
            res.status(401).json({ message: "Wrong password" })
        }
    } else {
        res.status(401).json({ message: "User not found" })
    }
})

//CRUD KARIAWAN

//READ ALL
router.get('/all-kariawan', auth, async (req, res) => {
    const kariawan = await prisma.karyawan.findMany({
        include: {
            users: {
                select: {
                    username: true
                }
            }
        }
    })
    console.log(kariawan);
    //make created by and updated by
    await Promise.all(kariawan.map(async (item) => {
        if (item.created_at || item.update_at === null) {
            delete item.user_id
            delete item.users
        }
    }))
    res.status(200).json(kariawan)
})

//READ BY ID
router.get('/kariawan/:id', auth, async (req, res) => {
    const kariawan = await prisma.karyawan.findUnique({
        where: {
            id: Number(req.params.id)
        }
    })
    res.status(200).json(kariawan)
})

//CREATE
router.post('/create-kariawan', auth, async (req, res) => {
    const { userId } = req.user;
    const { nama, nama_karyawan, no_hp } = req.body;
    const kariawan = await prisma.karyawan.create({
        data: {
            nama: nama,
            nama_karyawan: nama_karyawan,
            nomor_induk: nomor_induk,
            users: {
                create: {
                    id_user: Number(userId)
                }
            },
            created_at: new Date()
        }
    })
    res.status(200).json(kariawan)
})

//UPDATE
router.put('/update-kariawan/:id', auth, async (req, res) => {
    const { userId } = req.user;
    const { nama, alamat, no_hp } = req.body;
    const kariawan = await prisma.karyawan.update({
        where: {
            id: Number(req.params.id)
        },
        data: {
            nama_karyawan: nama,
            nomor_induk: alamat,
            update_at: new Date(),
            user_id: Number(userId)
        }
    })
    res.status(200).json(kariawan)
})

//DELETE
router.delete('/delete-kariawan/:id', auth, async (req, res) => {
    const kariawan = await prisma.karyawan.delete({
        where: {
            id: Number(req.params.id)
        }
    })
    res.status(200).json(kariawan)
})


server.use('/api', router)
const { applyPassportStrategy } = require('./auth/index')
applyPassportStrategy(passport)
server.use(passport.initialize())
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})

