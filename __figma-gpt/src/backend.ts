/// <reference types="vite/client" />
/// <reference types="@figma/plugin-typings" />

if (figma.editorType === 'figma') {
    console.log('figma', typeof fetch)

    figma.showUI(__html__, {
        height: 240,
        width: 500,
    })

    figma.ui.onmessage = async (msg) => {
        if (msg.type === 'code') {
            // console.log(msg.code)
            let code = extractCode(msg.code)
            console.log('code\n', code)
            eval(code)
            return
        }

        // figma.closePlugin()
    }
} else {
    // TODO figjam
}

function extractCode(msg: string): string {
    // if return markdown then only return code inside
    if (msg.includes('```')) {
        msg = msg.split('```')[1]
    }
    return msg
}
