import Head from 'next/head'

const Fallback = () => (
    <>
        <Head>
            <title>Woonnet Rijnmond Bot</title>
        </Head>
        <h1>Not connected to the internet</h1>
        <h2>Cant fetch realtime data now :(</h2>
    </>
)

export default Fallback
