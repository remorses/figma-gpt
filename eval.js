// TODO: add the ability to reference nodes (#name or something)
// TODO: add ability to store and reference variables between nodes
// TODO: add node selection prompt and wait for user to select it

function isUndefined(n) {
    return typeof n === 'undefined'
  }
  
  function isValidNode(node) {
    if (node.removed) return false
    const t = node.type
    return t === 'TEXT' || t === 'CODE_BLOCK' || t === 'SHAPE_WITH_TEXT' || t === 'STICKY'  
  }
  
  async function solve(inputNode) {
    // add relaunch before running the script in case of errors
    addRelaunch(inputNode)
  
    let expr = ''
  
    // load text in a way appropriate to the node type
    switch (inputNode.type) {
      case 'TEXT':
        expr = inputNode.characters
        break
      case 'CODE_BLOCK':
        expr = inputNode.code
        break
      default:
        expr = inputNode.text.characters
        break
    }
  
    // don't process empty nodes
    if (expr === '' || typeof expr !== 'string') {
      return null
    }
    
    let result
    let isError = false
    try {
      result = await evaluate(expr)
    } catch (e) {
      result = e
      isError = true
      console.log('Error in your code!\n', e)
    }
  
    const resultString = '' + result
    // ignore result if it's empty or undefined
    if (resultString.length === 0 || isUndefined(result)) {
      return null
    }
  
    const sol = await createSolutionNode(inputNode, resultString, isError)
    return sol
  }
  
  async function evaluate(expr) {
    const run = async () => {
      return await eval(`{ ${expr} }`)
    }
    return run.call(null)
  }
  
  async function loadFont(node) {  
    const font = node.getRangeFontName(0, 1)
    await figma.loadFontAsync(font)
    return font
  }
  
  async function createSolutionNode(inputNode, resultString, isError) {
    const solution = inputNode.clone()
    solution.relativeTransform = inputNode.absoluteTransform
    solution.y += inputNode.height + 4
  
    // set text in a way appropriate to the node type
    switch (solution.type) {
      case 'TEXT':
        solution.fontName = await loadFont(inputNode)
        solution.characters = resultString
        break
      case 'CODE_BLOCK':
        await figma.loadFontAsync({ family: "Source Code Pro", style: "Medium" })
        solution.code = resultString
        break
      default:
        solution.text.fontName = await loadFont(inputNode.text)
        solution.text.characters = resultString
        break
    }
  
    if (isError && solution.type !== 'CODE_BLOCK') {
      solution.fills = [{ color: { r: 1, g: 0.2, b: 0.2 }, type: 'SOLID' }]
    }
  
    // add after input to the same parent
    const parent = inputNode.parent
    const index = parent.children.indexOf(inputNode) + 1
    parent.insertChild(index, solution)
  
    addRelaunch(solution)
  
    return solution
  }
  
  async function main() {
    const solutions = []
    const sel = figma.currentPage.selection
    for (let i = 0; i < sel.length; i++) {
      const item = sel[i]
      if (isValidNode(item)) {
        addRelaunch(item)
        const sol = await solve(item)
        sol && solutions.push(sol)
      }
    }
  
    figma.currentPage.selection = solutions
    figma.closePlugin('Math')
  }
  
  function addRelaunch(node) {
    node.setRelaunchData({ open: '' })
  }
  
  main().catch(e => {
    console.error(e)
    figma.notify('Something broke but not your code! ' + e.message, {error: true})
    figma.closePlugin()
  })