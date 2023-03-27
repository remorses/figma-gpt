import {} from 'openai-fetch'

if (figma.editorType === 'figma') {
    figma.showUI(__html__)

    figma.ui.onmessage = (msg) => {
        if (msg.type === 'prompt') {
            const nodes: SceneNode[] = []
            const prompt = msg.prompt

            eval(`const rect = figma.createRectangle(); nodes.push(rect);`)
            // figma.currentPage.selection = nodes
            // figma.viewport.scrollAndZoomIntoView(nodes)
        }

        figma.closePlugin()
    }
} else {
    // TODO figjam
}
