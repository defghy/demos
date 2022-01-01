(function () {
	'use strict';

	class s{constructor({self:s,other:t}){this.handlers={},this.callbacks={},this.self="",this.other="",this.init=()=>{window.addEventListener("message",(async s=>{var t,e;const{selfKey:a,otherKey:i}=this,{from:n,eventName:r,params:l,callback:h,status:o}=s.data;if(n!==i)return;if("res"===o)return null==(e=(t=this.callbacks)[h])?void 0:e.call(t,l);if(!r.startsWith(this.self))return;const c=this.handlers[r],f=await(null==c?void 0:c(l));window.postMessage({from:a,status:"res",eventName:r,params:f,callback:h},"*");}));},this.on=async(s,t)=>{this.handlers[s]=t;},this.call=async(s,t)=>{const{callbacks:e}=this,a=`hytest_extension_${Date.now()}`;return window.postMessage({from:this.selfKey,status:"req",eventName:s,params:t,callback:a},"*"),new Promise((s=>{e[a]=function(t){delete e[a],s(t);};}))},this.self=s,this.other=t,this.init();}get selfKey(){return `${this.self}:extension`}get otherKey(){return `${this.other}:extension`}}

	window.PageExtensionSDK=new s({self:"page",other:"content"});

}());
