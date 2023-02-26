var webgl: WebGLRenderingContext
var vertexShaderObject: WebGLShader
var fragmentShaderObject: WebGLShader
var programObject: WebGLProgram
var triangleBuffer: WebGLBuffer
var v3PositionIndex = 0

/**
 * 在显卡在执行， 针对于顶点的输入
 * @description: vertex ve
 */
var shaderVs = `
  attribute vec3 v3Position;
  void main(void) {
    gl_Position = vec4(v3Position, 1.0);
  }
`
/**
* @description: 在显卡在执行， 给形状填充颜色
* @return {*}
*/
var shaderFs = `
  void main(void) {
    gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);
  }
`

function init(): void {
  var canvas = document.getElementById('myCanvas') as HTMLCanvasElement
  // 获取webgl
  webgl = canvas.getContext('webgl') as WebGLRenderingContext

  // 设置webgl的视口大小
  webgl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight)

  webgl.clearColor(1.0, 1.0, 0.0, 1.0)

  // 创建一个顶点的shader
  vertexShaderObject = webgl.createShader(webgl.VERTEX_SHADER) as WebGLShader

  // 创建
  fragmentShaderObject = webgl.createShader(webgl.FRAGMENT_SHADER) as WebGLShader

  // 将创建好的代码赋值一段代码
  webgl.shaderSource(vertexShaderObject, shaderVs)
  webgl.shaderSource(fragmentShaderObject, shaderFs)

  // 编译shader， 生成显卡可以执行的汇编或者二进制代码
  webgl.compileShader(vertexShaderObject)
  webgl.compileShader(fragmentShaderObject)

  /**
   * @description: 获取编译的状态
   */
  if (!webgl.getShaderParameter(vertexShaderObject, webgl.COMPILE_STATUS)) {
    alert('error:vertexShaderObject')
    // 获取编译失败的原因
    console.error(webgl.getShaderInfoLog(vertexShaderObject));
    return
  }
  if (!webgl.getShaderParameter(fragmentShaderObject, webgl.COMPILE_STATUS)) {
    alert('error:fragmentShaderObject')
    return
  }

  /**
   * @description: 创建一个程序
   */
  programObject = webgl.createProgram() as WebGLProgram

  /**
   * @description: 将编译器好的代码导入webgl
   */
  webgl.attachShader(programObject, vertexShaderObject)
  webgl.attachShader(programObject, fragmentShaderObject)

  /**
   * @description: 将programObject的v3PositionIndex 与 ``的v3Position 进行绑定
   */
  webgl.bindAttribLocation(programObject, v3PositionIndex, "v3Position")

  /**
   * @description: 链接到二进制文件中，生成可执行体
   */
  webgl.linkProgram(programObject)

  if (!webgl.getProgramParameter(programObject, webgl.LINK_STATUS)) {
    alert("error:programObject ")
    return
  }

  /**
   * @description: 使用这个可执行程序
   */
  webgl.useProgram(programObject)

  /**
  * @description: 创建一个顶点缓存区数据
  */
  var jsArrayData = [
    0.0, 1.0, 0.0,
    -1.0, -1.0, 0.0,
    1.0, -1.0, 0.0
  ]

  /**
   * @description: 创建一个缓存区对象
   */
  triangleBuffer = webgl.createBuffer() as WebGLBuffer

  /**
  * @description: 指定缓存区对象存储的类型, 他还有另外一个作用，指定当前运行环境的上下文
  */
  webgl.bindBuffer(webgl.ARRAY_BUFFER, triangleBuffer)

  /**
   * @description: 将内存中的数据传到显卡中,第一种方式
   * 第三个参数： 告诉显卡数据的类型：静态或者动态
   */
  // webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(jsArrayData), webgl.STATIC_DRAW)

  /**
  * @description: 将内存中的数据传到显卡中,第二种方式
  */
  webgl.bufferData(webgl.ARRAY_BUFFER, 4*9, webgl.STATIC_DRAW)
  webgl.bufferSubData(webgl.ARRAY_BUFFER, 0, new Float32Array(jsArrayData))
}

/**
 * 绘制场景函数
 */
function renderScene() {
  /**
   * @description: 设置清除成什么颜色
   */
  webgl.clearColor(0.0, 0.0, 0.0, 1.0)
  /**
   * @description: 清除颜色
   */
  webgl.clear(webgl.COLOR_BUFFER_BIT) //颜色缓存区

  /**
   * @description: 使用缓存区
   */
  webgl.bindBuffer(webgl.ARRAY_BUFFER, triangleBuffer)


  /**
   * @description: 申明给顶点变量赋值
   */
  webgl.enableVertexAttribArray(v3PositionIndex)
  /**
   * @description: 给显卡中的变量赋值
   * 1: 给那个变量赋值
   * 2、变量的类型是几维数据
   * 3、变量的类型是什么
   * 4、是否规格化
   * 5、变量的间隔
   * 6、
   */
  webgl.vertexAttribPointer(v3PositionIndex, 3, webgl.FLOAT, false, 0, 0)
  /**
   * @description: 执行绘制
   */
  webgl.drawArrays(webgl.TRIANGLES, 0, 3)
}

function tick() {
  renderScene();
}


function webGlStart() {
  init();
  // 进行游戏循环
  tick();
}