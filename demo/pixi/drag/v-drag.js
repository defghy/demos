const Vue = window.Vue;
Vue.config.devtools = true;

Vue.directive('drag', {
	bind: function(el, binding, vnode) {
		var hammertime = Hammer(el, {
	    transform_always_block:true,
	    transform_min_scale:0.5,
	    drag_block_horizontal:true,
	    drag_block_vertical:true,
	    drag_min_distance:0
		});

		var isDragging = false;
		let lastDeltaX = 0;
		let lastDeltaY = 0;
		hammertime.on('pan', function(e){
			if (!isDragging) {
				lastDeltaX = 0;
				lastDeltaY = 0;
				isDragging = true;
			}
			
			// move our element to that position
			vnode.context[binding.expression]({
				deltaX: e.deltaX - lastDeltaX,
				deltaY: e.deltaY - lastDeltaY,
				event: e,
			});

			lastDeltaX = e.deltaX;
			lastDeltaY = e.deltaY;

			if (e.isFinal) {
				isDragging = false;
			}
		});
	}
});
