(function($){
	var Slider = function(slider){
		var _this = this;
		this.slider = slider;
		//设置当前索引值；
		this.now = 0;
		//获取各个节点
		this.sliderList = slider.find('ul.xxSlider-list');
		this.sliderPrevBtn = slider.find('div.xxSlider-prev-btn');
		this.sliderNextBtn = slider.find('div.xxSlider-next-btn');
		this.sliderItem = slider.find('ul.xxSlider-list li');
		this.sliderFirstList = this.sliderItem.first();
		this.createSpan();
		this.sliderSpan = slider.find('ul.xxSlider-list .allSpan');
		this.sliderSpanList = this.sliderSpan.children();
		this.rotateFlag = true;
		this.timer = 0;
		//配置默认参数
		this.setting = {
			"width":1000,//幻灯片的总宽度
	                      "height":300,//幻灯片总高度
	                      "sliderWidth":760,//幻灯片第一帧的宽度
	                      "sliderHeight":250,//幻灯片第一帧的高度
	                      "speed":500,//转换速度
	                      "scale":0.9,//缩放程度
	                      "autoPlay":false,
	                      "delay":2000
		}
		$.extend(this.setting,this.getSetting());
		this.setSettingValue();
		// this.AlignFrames(0)
		this.sliderNextBtn.click(function(){
			if(_this.rotateFlag == true){
				_this.rotateFlag = false;
				_this.AlignFrames(_this.now + 1);
			};
		});
		this.sliderPrevBtn.click(function(){
			if(_this.rotateFlag == true){
				_this.rotateFlag = false;
				console.log(_this.rotateFlag);
				_this.AlignFrames(_this.now - 1);

			};
		});
		for(var i = 0;i < this.sliderSpanList.length;i++){
			(function(j){
				_this.sliderSpanList.eq(j).mouseenter(function(){
					if(j == _this.now){
						return;
					}else if(_this.rotateFlag == true){
						_this.rotateFlag = false;
						_this.AlignFrames(j);
					}
				})
			})(i);	
		}
		if(this.setting.autoPlay){
			this.autoPlay();
			this.slider.hover(function(){
				clearInterval(_this.timer);
			},function(){
				_this.autoPlay();
			})
		}
	}
	Slider.prototype = {
		//自动播放函数
		autoPlay:function(){
			var _this = this;
			this.timer = setTimeout(function(){
				_this.AlignFrames(_this.now + 1);
				_this.autoPlay();
			},_this.setting.delay);
		},
		//排列帧函数
		AlignFrames:function(i){
			this.curList(this.iLoop(i));
			if(i > this.now){
				this.now = this.iLoop(i);
				this.adjList(this.iLoop(this.now),'right');
				this.specialList(this.iLoop(this.now - 2),'right');
				this.otherList(this.iLoop(this.now),'right');
			}else if(i <= this.now){
				this.now = this.iLoop(i);
				this.adjList(this.iLoop(this.now),'left');
				this.specialList(this.iLoop(this.now + 2),'left');
				this.otherList(this.iLoop(this.now),'left');
			}
			for(var j = 0;j < this.sliderSpanList.length;j++){
				this.sliderSpanList.eq(j).css('background','#555')
			}
			this.sliderSpanList.eq(this.iLoop(i)).css('background','#FF630E');
		},
		//定义剩余帧的样式
		otherList:function(i,dir){
			var _this = this;
			if(dir == 'right'){
				for(var j = 0;j < this.sliderItem.length;j++){
				           if(j == i || j == this.iLoop(i - 1) || j == this.iLoop(i - 2) || j == this.iLoop(i + 1)){
				           	continue;
				           }else{
				           	var otherList = this.sliderItem.eq(j);
				           	otherList.css('zIndex',0);
				           	otherList.animate({
				           		width:0,
				           		height:0,
				           		left:this.setting.width * 0.5,
				           		top:this.setting.height * 0.5,
				           		opacity:0
				           	},_this.setting.speed)
				           }
			           }
			}else if(dir == 'left'){
				for(var j = 0;j < this.sliderItem.length;j++){
				           if(j == i || j == this.iLoop(i - 1) || j == this.iLoop(i + 2) || j == this.iLoop(i + 1)){
				           	continue;
				           }else{
				           	var otherList = this.sliderItem.eq(j);
				           	otherList.css('zIndex',0);
				           	otherList.animate({
				           		width:0,
				           		height:0,
				           		left:this.setting.width * 0.5,
				           		top:this.setting.height * 0.5,
				           		opacity:0
				           	},_this.setting.speed)
				           }
			           }
			}
		},
		//定义特殊帧的样式
		specialList:function(i,dir){
			var _this = this;
			var zIndex = 0,
			      left = 0,
			      width = this.setting.sliderWidth * 0.5,
			      height = this.setting.sliderHeight * 0.5,
			      top = height * 0.5;
			var specialList = this.sliderItem.eq(i);
			if(dir == 'right'){
				zIndex = this.sliderItem.eq(this.iLoop(i + 1 )).css('zIndex') - 1;
				left = -width;
			}else if(dir == 'left'){
				zIndex = this.sliderItem.eq(this.iLoop(i - 1 )).css('zIndex') - 1;
				left = this.setting.width;
			}
			specialList.css('zIndex',zIndex);
			specialList.animate({
				height:height,
				width:width,
				left:left,
				opacity:0,
				top:top
			},_this.setting.speed);

		},
		//定义与当前帧相邻帧的样式.
		adjList:function(i,dir){
			var _this = this;
			var adjLeftList = this.sliderItem.eq(this.iLoop(i - 1));
			var adjRightList = this.sliderItem.eq(this.iLoop(i + 1));
			var zIndex = Math.floor(this.sliderItem.length / 2) - 1,
			      width = this.setting.sliderWidth * this.setting.scale,
			      height = this.setting.sliderHeight * this.setting.scale,
			      rightLeft = this.setting.width - width,
			      leftLeft = 0,
			      top = (this.setting.height - this.setting.sliderHeight * this.setting.scale) / 2;
			 if(dir == 'right'){
			 	adjRightList.css('left',this.setting.width * 0.5 + width);
			 }
			 if(dir == 'left'){
			 	adjLeftList.css( 'left',this.setting.width * 0.5 - width);
			 }    
			adjRightList.css({
				'zIndex':zIndex,
				
			})
			adjRightList.animate({
				left:rightLeft,
				opacity:1,
				width:width,
				height:height,
				top:top
			},_this.setting.speed); 
			adjLeftList.css({
				'zIndex':zIndex,
			});
			 adjLeftList.animate({
			 	left:leftLeft,
			 	opacity:1,
			 	width:width,
				height:height,
				top:top
			},_this.setting.speed)     
		},
		//定义当前帧的样式.
		curList:function(i){
			var _this = this;
			//设置当前帧的样式
			var curList = this.sliderItem.eq(i);//用数组的方式获取jQuery的DOM节点再调用jQuery方法是无效的
			curList.css('zIndex',Math.floor(this.sliderItem.length / 2));
			curList.animate({
				left:(this.setting.width - this.setting.sliderWidth) / 2,
				width:this.setting.sliderWidth,
				height:this.setting.sliderHeight,
				opacity:1,
				top:(this.setting.height - this.setting.sliderHeight) / 2
			},_this.setting.speed,function(){
				_this.rotateFlag = true;
			});
		},
		//定义一个循环i的函数,
		iLoop:function(i){
			if(i >= this.sliderItem.length){
				return i %= this.sliderItem.length;
			}else if(i < 0){
				return i += this.sliderItem.length;
			}else{
				return i;
			}
		},
		//设置人工参数
		setSettingValue:function(){
			var _this = this;
			this.sliderList.css({
				width:this.setting.width,
				height:this.setting.height
			});
			this.sliderItem.css({
				width:this.setting.sliderWidth,
				height:this.setting.sliderHeight * 0.5,
				top:this.setting.sliderHeight * 0.25,
			});
			this.sliderPrevBtn.css({
				width:(this.setting.width - this.setting.sliderWidth) / 2,
				height:this.setting.sliderHeight * this.setting.scale,
				top:(this.setting.height - this.setting.sliderHeight * this.setting.scale) / 2,
				left:0,
				zIndex:Math.ceil((this.sliderItem.length) / 2)
			});
			this.sliderNextBtn.css({
				width:(this.setting.width - this.setting.sliderWidth) / 2,
				height:this.setting.sliderHeight * this.setting.scale,
				top:(this.setting.height - this.setting.sliderHeight * this.setting.scale) / 2,
				left:(this.setting.width - this.setting.sliderWidth) / 2 + this.setting.sliderWidth,
				zIndex:Math.ceil((this.sliderItem.length) / 2)
			});
			this.sliderSpan.css({
				marginLeft:-(this.sliderSpan.width() / 2)
			})
			this.sliderItem.eq(0).css({
				zIndex:Math.ceil((this.sliderItem.length) / 2),
				width:this.setting.sliderWidth,
				height:this.setting.sliderHeight,
				left:(this.setting.width - this.setting.sliderWidth) / 2,
				top:(this.setting.height - this.setting.sliderHeight) / 2
			})
			this.sliderItem.eq(_this.sliderItem.length - 1).css({
				zIndex:Math.ceil((this.sliderItem.length) / 2) - 1,
				width:this.setting.sliderWidth * this.setting.scale,
				height:this.setting.sliderHeight * this.setting.scale,
				left:0,
				top:(this.setting.height - this.setting.sliderHeight * this.setting.scale) / 2
			})
			this.sliderItem.eq(1).css({
				zIndex:Math.ceil((this.sliderItem.length) / 2) - 1,
				width:this.setting.sliderWidth * this.setting.scale,
				height:this.setting.sliderHeight * this.setting.scale,
				left:this.setting.width - this.setting.sliderWidth * this.setting.scale,
				top:(this.setting.height - this.setting.sliderHeight * this.setting.scale) / 2
			})
			
		},
		//获取人工设置值
		getSetting:function(){
			var data = this.slider.attr('data-setting');
			if(data && data != ''){
				return $.parseJSON(data);
			}else{
				return {};
			}
		},
		//动态创建span
		createSpan:function(){
			for(var i = 0;i < this.sliderItem.length;i++){
				this.sliderList.append('<span></span');
			}
			$('ul.xxSlider-list span').wrapAll('<div class="allSpan"></div>');
		}
	}
	//初始化
	Slider.init = function(sliders){
		var _this = this;
		sliders.each(function(i,elem){
			new _this($(this));
		})
	};
	window.Slider = Slider;
})(jQuery)


//总结：利用面向对象的方法来封装插件。在思想上面要有大局观念，以函数代替数字。从这个例子中学到以下解决问题的方法
//1、利用$.parseJSON()来将数据转换为JSON格式
//2、一种新的轮播图的思想，记住上一帧的样式。
//3、Jquery方法必须由jQueryDOM来调用
//4、z-index会受到浮动的影响
//5、relative会影响height100%继承