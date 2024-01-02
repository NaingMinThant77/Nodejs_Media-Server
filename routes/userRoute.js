module.exports = (express) => {
    let route = express.Router();

    route.get('/home', (req, res) => {
        res.send({ data: "user Home Route"})
    })

    route.get('/about', (req, res) => {
        res.send({ data: "user Home's about Route"})
    })


    return route;
}