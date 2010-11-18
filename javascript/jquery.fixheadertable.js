/*!
* jquery.fixheadertable
*
* Copyright (c) 2010 Benjamin Léouzon
* http://www.tablefixedheader.com/
*
* Licensed under MIT
* http://www.opensource.org/licenses/mit-license.php
* 
* http://docs.jquery.com/Plugins/Authoring
* jQuery authoring guidelines
*
* Launch  : August 2010
* Version : 1.2.1 November 2010
*/

(function($) { 

	$.fn.fixheadertable = function(options) {
		  
		var defaults = {  
			
			caption		 : '',
			
			theme		 : 'ui',
			
			height		 : null,
			
			colratio	 : [],
			
			whiteSpace	 : 'nowrap',
			
			addTitles	 : false,
			
			width		 : null, 
			
			minWidth	 : null,
			
			minWidthAuto : true,
			
			zebra		 : false
		};  
		
		var options = $.extend(defaults, options); 
		
		// GLOBALS
		
		var nbcol 				= $('thead th', this).length;
		
		var _initialWidth		= $(this).width();
		
		var _wrapper 			= null;
		
		var _headerscontainer	= null;
		
		var _fillScrollbar 		= null;
		
		var _body 				= null;
		
		var _headers			= null;
		
		var _scrollWidth		= getScrollbarWidth();
		
		var _colgroup			= buildColgroup(nbcol);
						
		/**
		 * 	Return the scrollbar width depending on the browser
		 * 
		 * */
				
		function getScrollbarWidth () {
						
			var inner = $('<p/>').addClass('t_fixed_header_scroll_inner');
			
			var outer = $('<div/>').addClass('t_fixed_header_scroll_outer');
			
			outer.append(inner);
			
			$(document.body).append(outer);
			
			var w1 = inner[0].offsetWidth;  
			
			outer.css('overflow', 'scroll');
			
			var w2 = inner[0].offsetWidth;  
			
			if (w1 == w2) w2 = outer[0].clientWidth;  
			
			outer.remove();
			
			return (w1 - w2);			
		}
		
		/**
		 *  Top construction
		 * 
		 * */
		
		function buildTop (table) {
			
			_fillScrollbar = $('<div class="headtable ui-state-default" style="padding-right : 0px"></div>');
			
			_headerscontainer = _fillScrollbar;
			
			_headerscontainer.insertBefore(table);
		}
		
		/**
		 * Colgroup & cols construction equiwidth
		 * 
		 * */
		
		function buildColgroup (nbcol) {
				
			var colgroup = $('<colgroup />');
			
			if (options.colratio.length == 0) {
			
				var temp = null;
				
				for (var i = 0; i < nbcol; i++) {
					
					temp = $('<col style="width : ' + (100/nbcol) + '%" />');
					
					colgroup.append(temp);

					temp = null;
				}
			
			} else if (options.colratio.length == nbcol) {
				
				for (var i = 0; i < nbcol; i++) {
					
					temp = $('<col style="width : ' + options.colratio[i] + '" />');
					
					colgroup.append(temp);

					temp = null;
				}
			}
			
			return colgroup;
		}
		
		/**
		 * Headers construction
		 * 
		 * */
		
		function buildHeaders(table) {
			
			_headers = $('<table class="head"/>').append(_colgroup).append($('thead', table));
			
			_headerscontainer.append(_headers);			
			
			$('th', _headers).addClass('ui-widget-content');
		}
		
		function isIE6_7() {
			
			if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
				
        		var ieversion = new Number(RegExp.$1);
        		 
 				if (ieversion == 7 || ieversion == 6) {
 					
        				return true;
        		}
        		else {
        				return false;
        		}
        	}
		}
				
		/**
		 * Body construction
		 * 
		 * */
		
		function buildBody (table, scroll) {
			
			if(options.height != null && (parseInt(options.height) != 'NaN')) {
			
				_body.css('height', options.height + 'px');
			}
			
			_body.css('overflow-y', scroll);
			
			$(table).prepend(_colgroup.clone());
			
			if(options.zebra) {
				
				$('tr:odd', table).addClass('odd');
			
				$('tr:even', table).addClass('even');	
			}
			
			$('tr td', table).addClass('ui-widget-content');
			
			if (options.addTitles == true) {
			
				$('tr td', table).each(function() {
					
						$(this).attr('title', $(this).text());
				});			
			}
		}
		
		/**
		 * Adapt the table to the scrollBar offset
		 * 
		 * */
		
		function adaptScroll (table) {
			
			_body = $('<div class="body ui-widget-content"></div>').insertBefore(table).append(table);
			
			var scrollwidth = _scrollWidth;
        	
        	if(isIE6_7()){
        		
        		scrollwidth = 0; 
        	}
        	
        	var width = 0;
        							
			if (parseInt($(table).height()) > parseInt(options.height)) { 
								
				width = scrollwidth;
				
				overflow = 'scroll';
				
			} else { 
								
				width = 0;
					
				overflow = 'auto';
			}
			
			_fillScrollbar.css('padding-right', width);
			
			buildBody(table, overflow);				
		}
	
		return this.each(function() {		
		
			_wrapper = $('<div/>').addClass('t_fixed_header ' + options.theme).insertBefore(this).append(this);
			
			buildTop(this);
			
			buildHeaders(this);	
			
			adaptScroll(this);	
			
			if (options.minWidth != null && (parseInt(options.minWidth) != 'NaN') && options.minWidth > 0) {
				
				var minWidth = options.minWidth + 'px';
				
			} else if (options.minWidthAuto) {
				
				var minWidth = (_initialWidth + 150) + 'px';	
			}
				
			var scrollWidth = _scrollWidth + 'px';
			
			var height = options.height + 'px';
			
			_wrapper.css('min-width', minWidth);
			
			var tampon = _wrapper.wrap("<div></div>").parent();
			
			if (options.width != null && (parseInt(options.width) != 'NaN') && options.width > 0) {
				
				tampon.css('width', options.width + 'px');	
			}
			
			var res = _wrapper.detach();
			
			var main_wrapper = $('<div class="t_fixed_header_main_wrapper ui-widget ui-widget-header ' + options.theme + '"></div>');
			
			var main_wrapper_child = $('<div class="t_fixed_header_main_wrapper_child"></div>');
			
			main_wrapper.append(main_wrapper_child);
			
			main_wrapper_child.append(res);
			
			tampon.append(main_wrapper);	
			
			if(isIE6_7()){
			
				_body.css('margin-bottom', 17 + 'px');
			}
			
			if (options.caption != '') {
		
				main_wrapper.prepend('<div class="t_fixed_header_caption ui-widget-header ui-corner-top">' + options.caption + '</div>');
				
				main_wrapper.addClass('ui-corner-top');
			} 	
						
			var vertical_fake_scroll = $('<div style="right : 0px; width : 20px ; position : absolute; top : ' + (_headerscontainer.height() + $('div.t_fixed_header_caption', main_wrapper).height() + 2) + 'px; height : ' + height + '; overflow-y : auto; overflow-x : hidden; z-index : 10000"><div class="" style="height : ' + $(this).height() + 'px; width : ' + scrollWidth + '; overflow : hidden">&nbsp;</div></div>');
			
			vertical_fake_scroll.css('overflow-y', 'auto');
			
			vertical_fake_scroll.scroll(function(){
				
				_body.scrollTop($(this).scrollTop());
			});
			
			_body.scroll(function(){
				
				vertical_fake_scroll.scrollTop($(this).scrollTop());
			});
			
			main_wrapper.append(vertical_fake_scroll);		
				
			$('tr:first', _body).addClass('first_tr');
			
			$('tr', _body).each(function(){
				
				$('td:last', this).addClass('last_td');	
			});	
			
			$('th:last', _headerscontainer).addClass('last_td');	
						
			if (options.whiteSpace == 'normal') {
			
				_wrapper.addClass('t_fixed_header_wrap');
				
				vertical_fake_scroll.children().first().css("height", $(this).height());
			}		
		}); 	 
	};  

})(jQuery);
