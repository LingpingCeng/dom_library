(function(){
	//通用绑定事件
	var addEvent = function(element,type,fn){
		if(element.addEventListener){
			element.addEventListener(type,fn,false);
		}else{
			element.attachEvent("on" + type,fn);
		}
	}
	//通用移除事件方法
	var removeEvent = function(element,type,fn){
		if(element.removeEventListener){
			element.removeEventListener(type,fn,false);
		}else{
			element.detachEvent("on" + type,fn);
		}
	}





	//查找元素的方法
	function searchElements(selector){

			//字面量声明数组
			var  result = [];

			if(typeof selector ==  "string"){

				var reg = /^[#\.a-zA-Z]/;

				//用正则下的test()方法证明是否存在。能不匹配，成功就是true。
				if(reg.test(selector)){

					var first = selector[0];//找到selector第一个

					//传递过来的如果是id
					if(first == "#"){
						//selector.slice(1)表示如果传过来的是#div.剪切#。
						var elem = document.getElementById(selector.slice(1));
						result = elem ? [elem] : [];//表示elem是否存在，存在就放在[].


					}else if(first == "."){

						var elems = document.getElementsByTagName('*');
						var len = elems.length;

						for (var i = 0; i < len; i++) {
							
							var name = elems[i].className;//返回的的字符串
							var string = "###" + name.split(" ").join("###")+"###";//name.split(" ")把name转换为数组,join("###")
								//再转换为字符串,目的就是把name的字符串空格删掉。
								
							if(string.search("###" + selector.slice(1) +"###") !=-1){
								//search()方法比较有没有这个字符，没有就返回-1；
								result.push(elems[i]);
							}
						}
					}else{
						var elems = document.getElementsByTagName(selector);//返回是一个数组
						result = [].slice.call(elems,0);//建立一个空[],用slice的方法切割数组，返回一个新的数组，其实变相复制一份
					}
				}
			}else if(selector.nodeType == 1){//传过来的如果是一个元素,nodeType 属性返回节点的类型
				result.push(selector);
			}
			return result;
	}

	//获取样式表的样式
	function getStyle(elem,style){
		if(elem.currentStyle){
			return elem.currentStyle[style];
		}else{
			return window.getComputedStyle(elem,false)[style];
		}
	}

	function addPx(property,value){
		var object ={
			"z-index" : 1,
			"opacity" : 1
		}

		if(!object[property]){
			value +="px" ;
		}
		return value;

		// var arr = ["z-index","opacity"];

		// for(var i = 0 ,i < arr.length; i++){
		// 	if(property != arr[i]){
		// 		value += "px";
		// 		break;
		// 	}
		// }
		// return value;
	}
	

	//存储事件的对象
	var events = {};
	var only = 0;


	//构造函数
	function Init(selector){

		var arr = searchElements(selector);
		//console.log(arr)
		var len = arr.length;

		this.length = len;

		for(i = 0; i < len; i++){
			this[i] = arr[i];
		}
	}

	Init.prototype = {

		//循环操作当前this对象下的每一个元素（this对象是一个类数组）
		each:function(callback){
			for(var i =0; i<this.length;i++){
				callback.call(this[i],i,this[i]);
			}
		},

		addClass : function(name){			
			this.each(function(i,e){
				if($(e).hasClass(name) == false){
					e.className += " " + name;
				}
			})
		},

		hasClass : function(name){
			var arr = this[0].className.split(" ");
			var isExist = false;

			for(var i = 0; i <arr.length; i++){
				if(arr[i]==name){
					isExist = true;
				}
			}
			return isExist;
		},

		removeClass :function(name){

			//循环找到每个div的className
			//匹配classname有没有包含我们要删除的class （hasClass）
			//把包含的div用正则的reolace方法替换成空
			this.each(function(i,e){
				if($(e).hasClass(name) == true){
					var arr = this.className.split(" ");//split(" ")方法用于把一个字符串分割成字符串数组
					console.log(arr);
					for(var i = 0; i<arr.length;i++){					
						if(arr[i]==name){
							 arr.splice(i,1);
							console.log(arr);
							e.className=arr;
						}
						
					}
				}
			})
		},


		toggleClass :function(name){
			this.each(function(i,e){
				if($(e).hasClass(name)==teue){
					$(e).removeClass(name);
				}else{
					$(e).addClass(name);
				}
			})
		},


		append : function(element){
			this.each(function(i,e){
				if(typeof element == "string"){
					e.insertAdjacentHTML("beforeend",element);
				}else if(element.nodeType == 1){
					var elem = element.cloneNode(true);
					e.appendChild(elem);
				}
			});
		},

		appendTo : function(parent){
			console.log(this);
			var self = this;
			if(parent instanceof Init){//判断parent必须是一个$()构造的对象
				parent.each(function(i,e){
					if(e.nodeType == 1){
						var elem = self[0].cloneNode(true);
						//console.log(elem);
						e.insertAdjacentElement("beforeend",elem);//insertAdjacentElement插入元素节点
					}
				});
			}	
		},

		prepend : function(element){
			console.log(this);
			this.each(function(i,e){
				console.log(e);
				if(typeof element == "string"){
					//console.log(element);
					e.insertAdjacentHTML("afterbegin",element);//insertAdjacentElement插入字符串
				}else if(element.nodeType == 1){
					var elem = element.cloneNode(true);
					e.insetBefort(elem);
				}
			});
		},

		prependTo : function(parent){
			var self = this;
			if(parent instanceof Init){//判断parent必须是一个$()构造的对象
				parent.each(function(i,e){
					if(e.nodeType == 1){
						var elem = self[0].cloneNode(true);
						e.insertAdjacentElement("afterbegin",elem);//insertAdjacentElement插入元素节点
					}
				});
			}	

		},

		css : function(property,value){
			var len = arguments.length;
			// console.log(len);
			//获取css样式
			if(len == 1 && typeof property =="string"){
				console.log(len);

				//返回当前元素样式
				return getStyle(this[0],property);
				console.log()


			}

			//设置样式
			if(len == 2 && typeof property == "string"){

				if(typeof value == "number"){
					value = addPx(property,value);
				}

				this[0].style[property] = value;
				//this[0].style.background=200px;
			}

			//设置多个class样式
			if(typeof property == "object"){
				
				for(var key in property){
				console.log(key);
				console.log(property[key]);//通过这个key去获取key的值
					if(typeof property[key] == "number"){
						var value = addPx(key,property[key]);
					}else{
						var value = property[key];

					}

					this[0].style[key] = value;
				}
			}
		},



		attr : function(type,text){
			var len = arguments.length;
			//获取属性
			if(len == 1 && typeof type =="string"){
				//console.log( this[0].getAttribute(type));
				return this[0].getAttribute(type);
			}

			//设置属性值
			if(len == 2 && typeof type == "string"){
				console.log(this[0]);
				this[0].setAttribute(type,text);

			}

			//如果是对象，设置属性跟属性值
			if(typeof arguments[0]=="object"){
				for(var key in type){
					this[0].setAttribute(key,type[key]);
				}
			}



		},

		//获取同级元素
		siblings :　function(){
			var newDom = $("");//创建一个空对象
			var all = this[0].parentNode.children;
			//console.log(this[2]);
			var index = 0;

			for(var i = 0; i < all.length; i++){
				if(all[i] != this[0]){
					newDom[index]= all[i];
					index++;
				}
			}
			newDom.length = index;
			return newDom;

			//第二种方法
			// ar all = this[0].parentNode.children;
			// var arr =[];
			// var newDom = $("");

			// for(var i = 0; i < all.length; i++){
			// 	if(all[i] != this[0]){ 把跟自身不相同的拿出来，放到一个数组
			// 		arr.push(all[i])
			// 	}
			// }
			// 把上面arr数组转换为$对象
			// for(var i = 0; i < arr.length; i++){
			// 	if(all[i] != this[0]){
			// 		newDom[i] = arr[i];
			// 		newDom.length = i +1; 因为前面for删除了一个，所以需下标i+1；
			// 	}
			// }
			// return newDom;
		},


		//把自身给删除,并且返回自身
		remove :function(){

			var newarry = $("");
			var indenx = 0;
			console.log(this[0]);
			var farter =this[0].parentNode;
			var childrens = farter.children;

			for(var i=0; i < childrens.length; i++){
				if(this[0]==childrens[i]){
					newarry[indenx]=childrens[i];
					farter.removeChild(childrens[i]);
					newarry.length=indenx+1;

				}
			} 
			return newarry;

		// 	this.each(function(i,e){
		// 		var farter = e.parentNode;
		// 		farter.removeChild(e);
		// 	})
		// 	return this;
		},

		//查找同级下一个的节点
		next : function(){
			var that=this[0];
			function aaa(){
				var brother = that.nextSibling;
				if(brother.nodeType == 1){
					return 	brother;
				}else if(brother.nodeType == 3){
					that = brother;
					return aaa();
				}else if(brother.nodeType==null){
					return null;
				}
		 	}
		 	return aaa();

		},

		prev : function(){
				var that=this[0];
			function aaa(){
				var brother = that.previousSibling;
				if(brother.nodeType == 1){
					return 	brother;
				}else if(brother.nodeType == 3){
					that = brother;
					return aaa();
				}else if(brother.nodeType==null){
					return null;
				}
		 	}
		 	return aaa();
		},


		on : function(type,fn){
			this.each(function(i,e){
				//事件名唯一
				only++;
				var name = "handle" + only;//handle1

				//把事件和事件添加到events对象
				events[name] = fn;
				addEvent(e,type,fn);

				if(!e.eventName){
					e.eventName = {};
				}

				if(!e.eventName[type]){
					e.eventName[type] = [];
				}

				//把事件名添加到该元素的eventName属性上
				//eventName是一个对象
				//eventName = {
				//"click" : ["handle1"]
				//}
				e.eventName[type].push(name);
			})
		},


		off : function(type){
			this.each(function(i,e){
				if(e.eventName){

					//找到该元素下要删除的事件类型名
					var arr = e.eventName[type];
					for(var i = 0;i <arr.length;i++){
						//匹配events对象下的函数;
						removeEvent(e,type,events[arr[i]]);
					}
				}
			})


		},

		//把dom对象转换成类数组
		push : [].push,
		sort : [].sort,
		splice : [].splice
	}


	function Dom(selector){
        return new Init(selector);
	}

	window.$ = Dom;  

}())

