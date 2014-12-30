$(function () {

	GridExamplePageClass = function () {
		var _self = this;
		this.$appsContainer = $('#app-container');
		this.packeryOptions = {
			"columnWidth": 100,
			"rowHeight": 100,
			itemSelector: '.app'
			//transitionDuration: 0
		}
		this.resizeOptions = {
			resize: function(event,ui){_self.$appsContainer.packery( 'fit', event.target );},
			grid: [ 100, 100 ]
		}
		this.dragableOptions = {

		}
	};

	GridExamplePageClass.prototype.init = function () {
		this.bindEvents();
	};

	GridExamplePageClass.prototype.testFunction = function () {
		console.log('The testFunction has been called');
	};

	GridExamplePageClass.prototype.bindEvents = function () {
		var _self = this;
		var $apps = _self.$appsContainer.find('.app');
		//init the packery stuff
		_self.$appsContainer.packery(_self.packeryOptions);
		//init the resizable
		$apps.resizable(_self.resizeOptions);
		//init dragable
		$apps.draggable(_self.dragableOptions);
		//tell packery what has dragable bound
		_self.$appsContainer.packery( 'bindUIDraggableEvents', $apps );

//Attempt to reorder the dom to make a super sorter
		_self.$appsContainer.packery('on', 'dragItemPositioned', function( _pckry, draggedItem ) {
			var index = this.items.indexOf(draggedItem);
			var nextItem = this.items[ index + 1 ];
			//this looks like its using some vanilla JS
			if ( nextItem ) {
				_self.$appsContainer[0].insertBefore( draggedItem.element, nextItem.element );
			} else {
				_self.$appsContainer[0].appendChild( draggedItem.element );
			}
			//handling for saving the drag
			var ClonedContainer = _self.$appsContainer.clone(true);
			ClonedContainer.find('.ui-resizable-handle').remove();
			ClonedContainer.find('.ui-resizable.ui-sortable-handle').removeClass('ui-resizable ui-sortable-handle');
			// clear the last saved version
			window.localStorage.clear();
			//add the current app html to local storage
			localStorage.setItem('appLayout', ClonedContainer.html());
		});

///Local Storage
		_self.$appsContainer.packery( 'on', 'layoutComplete', function() {
			var ClonedContainer = _self.$appsContainer.clone(true);
			ClonedContainer.find('.ui-resizable-handle').remove();
			ClonedContainer.find('.ui-resizable.ui-sortable-handle').removeClass('ui-resizable ui-sortable-handle');
			// clear the last saved version
			window.localStorage.clear();
			//add the current app html to local storage
			localStorage.setItem('appLayout', ClonedContainer.html());
		});
		//add ability to delete the current save app state
		$('#delete-storage').on('click', function () {
			window.localStorage.clear();
			location.reload();
		});
////LocalStorage End
		//A button to add an app to the page
		$('#add-app').on('click',function(){
			var currentAppNumber = _self.$appsContainer.find('.app').length + 1;
			var $appHTML = $('<div class="app alert alert-success"></div>');
			var appText = 'An app yay. This is app number: ' + currentAppNumber;
			$appHTML.text(appText);
			$appHTML.attr('title',appText);
			$appHTML.resizable(_self.resizeOptions);
			$appHTML.draggable(_self.dragableOptions);
			_self.$appsContainer.append($appHTML);
			_self.$appsContainer.packery( 'bindUIDraggableEvents', $appHTML );
			_self.$appsContainer.packery( 'appended', $appHTML );
		});
	};

	window.GridExamplePageClass = new GridExamplePageClass();
	window.GridExamplePageClass.init();
});