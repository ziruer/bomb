var box = document.getElementById('box');
var mask = document.getElementById('mask');

var start = document.getElementById('restart');
var result = document.getElementById('result');

var gameOver = false;

var minesOver;

var blocks;
var maskBlocks;

bindEvent();

function bindEvent(){

	startgame();
	start.onclick = function(){
		startgame();
	}
}

// 开始游戏
function startgame() {
	console.log('startgame!!!');
	box.style.display = 'block';		
	mask.style.display = 'block';
	box.innerHTML = "";
	mask.innerHTML = "";
	result.style.display = 'none';

	init();
}

// 初始化
function init()
{
	minesOver = 10;
	gameOver = false;

	//创建遮罩层
	createMaskLevel();

	// 创建雷和数字层
	createDataLevel();
}

// 创建遮罩层
function createMaskLevel(){
	for(var i=0; i<10; i++)
	{
		for(var j=0; j<10; j++)
		{
			var con = document.createElement('div');
			con.setAttribute("id", i + "#" + j);
			con.classList.add("mask-block");
			// con.innerHTML = con.id;
			mask.appendChild(con);
			con.oncontextmenu = function (e){
				rightClick(e);
			}
			con.onclick = function(e)
			{
				leftclick(e.target);
			}
		}
	}
	mask.oncontextmenu = function(e)
	{
		e.preventDefault();
		console.log("clicked");
	}

	maskBlocks = document.getElementsByClassName('mask-block');

}

// 创建数据层
function createDataLevel(){
	for(var i=0; i<10; i++)
	{
		for(var j=0; j<10; j++)
		{
			var con = document.createElement('div');
			con.setAttribute("id", i + "-" + j);
			con.classList.add("block");
			box.appendChild(con);
		}
	}

	blocks = document.getElementsByClassName('block');

	var minesNum = 10;
	while(minesNum)
	{
		var index = Math.floor(Math.random()*100);
		if(blocks[index].classList.contains("isLei"))
		{
			continue;
		}
		blocks[index].classList.add("isLei");
		minesNum --;
	}

	for(var i=0; i<blocks.length; i++)
	{
		if(blocks[i].classList.contains("isLei"))
		{
			continue;
		}

		blocks[i].classList.add("num");
		var bombCount = getBombCount(i);

		if(bombCount != 0){
			blocks[i].innerHTML = bombCount;
		}
		else{
			blocks[i].classList.add("zero");
		}
		
	}
}

// 左击事件
function leftclick(maskBlock){
	if(gameOver) return;
	if(maskBlock.classList.contains("checked"))
	{
		return;
	}
	maskBlock.style.opacity = "0";
	maskBlock.classList.add("checked");

	var block = getMappingBlock(maskBlock);
	if(block.classList.contains("isLei")){
		// setTimeout("alert('Game Over!!!!')", 300);
		result.innerHTML = "挑战失败";
		result.style.display = 'block';
		result.style.color = '#f40';
		gameOver = true;
		showAllBombs();
		return;
	}


	// 如果点击的格子的雷的数目为0，则扩散点击
	if(block.classList.contains("zero"))
	{
		var position = maskBlock.id.split("#");
		var posX = +position[0];
		var posY = +position[1];

		for(var i = posX-1; i<=posX+1; i++)
		{
			for(var j = posY -1; j<=posY+1; j++)
			{
				if(i <0 || j<0) continue;
				if(i >9 || j>9) continue;
				var index = i*10+j;
				leftclick(maskBlocks[index]);
			}
		}
	}

}

// 右击事件
function rightClick(e){
	if(gameOver) return;
				if(e.button == 2)
				{
					var maskBlock = e.target;
					var block = getMappingBlock(maskBlock);
					if(maskBlock.classList.contains("flag")){
						maskBlock.classList.remove("flag");
						if(block.classList.contains("isLei")){
							minesOver ++;
						}						
					}
					else{
						e.target.classList.add("flag");
						if(block.classList.contains("isLei")){
							minesOver --;
							if(minesOver <= 0)
							{
								// setTimeout("alert('success!')", 300);
								result.innerHTML = "挑战成功";
								result.style.display = 'block';
								result.style.color = '#4d4';
								gameOver = true;
								return;
							}

						}
					}

				}
}

// 游戏结束后，显示所有的雷
function showAllBombs(){
	for(var i=0; i<blocks.length; i++)
	{
		if(blocks[i].classList.contains("isLei"))
		{
			maskBlocks[i].style.opacity = 0;
		}
	}
}


// 根据遮罩的block获取数据层block
function getMappingBlock(maskBlock){
	var position = maskBlock.id.split("#");
	var index = (+position[0])*10 + (+position[1]);
	return blocks[index];
}

// 获取该block周围雷的个数
function getBombCount(index){
	var posX = Math.floor(index/10);
	var posY = index % 10;

	var bombCount = 0;

	for(var i = posX-1; i<=posX+1; i++)
	{
		for(var j = posY -1; j<=posY+1; j++)
		{
			if(i <0 || j<0) continue;
			if(i >9 || j>9) continue;

			var index = i*10 + j;
			if(blocks[index] && blocks[index].classList.contains("isLei")){
				bombCount ++;
			}
		}
	}


	return bombCount;
}