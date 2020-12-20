class ResponseController {
    static ok(res, dto) {
        if (dto !== null) {
            return res.status(200).json(dto);
        } else {
            return res.status(200);
        }
    }
    static fail (res, error) {
        return res.status(500).json({
            message: error.toString()
        })
    }
}
module.exports = ResponseController;

