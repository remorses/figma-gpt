/// <reference types="vite/client" />
/// <reference types="@figma/plugin-typings" />

if (figma.editorType === 'figma') {
    figma.showUI(__html__, {
        height: 160,
        width: 540,
        title: '',
    })

    figma.ui.onmessage = async (msg) => {
        if (msg.type === 'code') {
            // console.log(msg.code)
            let code = extractCode(msg.code)
            console.log('code\n', code)
            try {
                eval(code)
            } catch (e) {
                console.error(e)
            }
            return
        }

        // figma.closePlugin()
    }
} else {
}

function extractCode(msg: string): string {
    // if return markdown then only return code inside
    if (msg.includes('```')) {
        msg = msg.split('```')[1]
    }
    return msg
}
