// middleware = interceptador (função que vai interceptar outra função e sempre vai receber req e res como parâmetros e tratará os mesmos)

export const json = async (req, res) => {
    const buffers = []

     for await (const chunk of req) {
        buffers.push(chunk)
    }

    try {
        req.body = JSON.parse(Buffer.concat(buffers).toString())
    } catch (error) {
        req.body = null
    } 

    res.setHeader("Content-type", "application/json")
}