import './style.css'

import { useEffect, useState } from 'preact/hooks'
import { OpenAIClient } from 'openai-fetch'

export default function App() {
    const [prompt, setPrompt] = useState('')

    let [loading, setLoading] = useState(false)
    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault()
                setLoading(true)
                try {
                    const code = await generateCode(prompt)
                    console.log(code)
                    parent.postMessage(
                        { pluginMessage: { type: 'code', code } },
                        '*',
                    )
                } catch (e) {
                } finally {
                    setLoading(false)
                }
            }}
            className='p-4 m-0 h-full w-full flex flex-col gap-2 overflow-hidden'
        >
            <div className='space-y-2 w-full'>
                <label
                    for='message'
                    class='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                    Prompt
                </label>

                <textarea
                    id='message'
                    rows={2}
                    className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    onChange={(e) => setPrompt(e.target['value'])}
                    placeholder='draw a rectangle'
                ></textarea>
            </div>
            <div className=''>
                <button
                    type='submit'
                    class='text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-[6px] text-center mr-2 mb-2'
                >
                    {loading ? 'loading' : `Run`}
                </button>
            </div>
        </form>
    )
}

let client: OpenAIClient

let APIKEY = import.meta.env.VITE_APIKEY

async function generateCode(prompt) {
    if (!APIKEY) {
        throw new Error('no api key')
    } else {
        client = new OpenAIClient({ apiKey: APIKEY })
        console.log(`created client`)
    }
    let realPrompt = makePrompt(prompt || '')

    let res = await client.createChatCompletion({
        messages: [
            {
                role: 'system',
                content:
                    'Only return valid javascript code, do not describe the code or return markdown',
            },
            { role: 'user', content: realPrompt },
        ],
        // maxTokens: 1000,
        model: 'gpt-3.5-turbo',
        temperature: 0.4,
    })
    let content = res.message.content
    console.log('content\n', content)
    return content
}

function makePrompt(prompt: string): string {
    return `create a figma plugin script in javascript that does the following: ${prompt}`
}
