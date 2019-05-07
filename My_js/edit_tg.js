/******************************************************
//要素の移動を行う機能
******************************************************/
function edit(){
  let editselect_array_tmp = new Array();
  let gX , gY , gWidth , gHeight;
  let change_gX , change_gY , change_gWidth , change_gHeight;
  let current_mode = $('input[name="tg_mode"]:checked').val();
  for(let i=0; i<editselect_array.length; i++){
    let select_element = SVG.get(editselect_array[i]);
    if(select_element){
      if(current_mode === 'Edit'){
        if(!select_element.hasClass('image')){
          select_element.addClass('edit_select');
          editselect_array_tmp.push(select_element.attr('id'));
          if(select_element.hasClass('path')){
            if(select_element.clear().array().settle().length < 2) select_element.remove();
          }
        }
      }else{
        if(select_element.hasClass('image')){
          draw.rect(select_element.width() , select_element.height()).attr({
            'fill' : 'none',
            'stroke' : '#f00',
            'stroke-width' : SELECT_RECT_STROKEWIDTH * 1.5,
            'stroke-dasharray': SELECT_RECT_STROKEDOTT, //点線に
            'transform' : select_element.transform('matrix')
          }).addClass('image_FrameRect');
          editselect_array_tmp.push(select_element.attr('id'));
        }
      }
    }
  }
  editselect_array = editselect_array_tmp;
  edit_mousedown_up();
  edit_hover();
  upload_handle();

  $(document).on('mouseup' , function() {
    if(event.button===0){
      if(now_movingFlag) cash_svg();
      now_movingFlag = false;
      $(document).off("mousemove");
      upload_handle();
    }
  })
}

/*********************************************
//マウスをmousedown_upしたときに起動する関数
//mode = off : イベントの全削除
**********************************************/
function edit_mousedown_up(mode){
  draw.off('mousedown').off('mouseup');
  if(mode!=="off"){
    if(draw.select('.edit_select').first()===undefined){ //選択状態の要素が何もない場合
      let select_rect = draw.rect().addClass('select_rect');
      select_rect.attr({  //範囲指定用四角形
        'fill' : 'none',
        'stroke': SELECT_RECT_COLOR,
        'stroke-width': SELECT_RECT_STROKEWIDTH,
        'stroke-dasharray': SELECT_RECT_STROKEDOTT //点線に
      })
      draw.on('mousedown', function(event){ //mousedown時：始点指定
        if(event.button===0){
          select_rect.draw(event);
          edit_hover("off");
        }
      });
      draw.on('mouseup', function(event){  //mouseup時：終点指定
        if(event.button===0){
          select_rect.draw(event);
          var sr_min_x =  Number(select_rect.attr('x')) , sr_min_y =  Number(select_rect.attr('y'));
          var sr_max_x =  sr_min_x + Number(select_rect.attr('width')) , sr_max_y =  sr_min_y + Number(select_rect.attr('height'));
          let current_mode = $('input[name="tg_mode"]:checked').val();
          let selector = ( current_mode == "Edit" ) ? '.SVG_Element' : '.image';

          draw.select(selector).each(function(i, children) {
            if(this.visible()){
              var InArea = true;  //範囲内に入っているかの判定
              var bbox = get_bbox(this);
              var pmin_x = bbox.min_x , pmax_x = bbox.max_x;
              var pmin_y = bbox.min_y , pmax_y = bbox.max_y;

              if(pmin_x < sr_min_x || pmin_x > sr_max_x) InArea = false;
              if(pmin_y < sr_min_y || pmin_y > sr_max_y) InArea = false;
              if(pmax_x < sr_min_x || pmax_x > sr_max_x) InArea = false;
              if(pmax_y < sr_min_y || pmax_y > sr_max_y) InArea = false;
              if(InArea){
                this.addClass('edit_select');
                editselect_array.push(this.attr('id'));
              }
            }
          })
          set_textsize();
          set_strokewidth();
          set_strokecolor();
          set_fillcolor();
          set_imageOpacity();
          edit_hover();
          edit_mousedown_up();
          select_rect.remove();
        }
      });
    }else{ //選択状態の要素が１つ以上ある場合
      draw.on('mousedown', function(event){
        if(event.button===0){
          edit_clear();
          edit_hover();
          edit_mousedown_up();
        }
      })
    }
  }
}

/******************************************************
//マウスをhoverしたときに起動する関数
******************************************************/
function edit_hover(mode){
  let current_mode = $('input[name="tg_mode"]:checked').val();
  let selector = ( current_mode == "Edit" ) ? '.SVG_Element' : '.image';
  draw.select(selector).off('mouseover').off('mouseout');
  SVG.get('handle_group').off('mouseover').off('mouseout');
  if(mode!=="off"){
    draw.select(selector).mouseover(function() {
      edit_mousedown_up("off");
      if(!this.hasClass('edit_select')){
        if(this.hasClass('image')){
          draw.rect(this.width() , this.height()).attr({
            'fill' : 'none',
            'stroke' : '#f00',
            'stroke-width' : SELECT_RECT_STROKEWIDTH * 1.5,
            'stroke-dasharray': SELECT_RECT_STROKEDOTT, //点線に
            'transform' : this.transform('matrix')
          }).addClass('image_FrameRect');
        }
        this.off('mousedown').mousedown(function(e){
          draw.select('.image_FrameRect').each(function(i,children){
            this.remove();
          })
          if(!(input_key_buffer[16] || input_key_buffer[17])) edit_clear();
          //this.attr({ stroke: PATH_SELECT_COLOR})
          this.addClass('edit_select');
          editselect_array.push(this.attr('id'));
          upload_handle();
          set_textsize();
          set_strokewidth();
          set_strokecolor();
          set_fillcolor();
          set_imageOpacity();
          this.off('mousedown');
          edit_hover();

          //クリック移動
          anchorX = getmousepoint('normal',e).x , anchorY = getmousepoint('normal',e).y;
          let click_dTx = 0 , click_dTy = 0;
          $(document).off('mousemove').mousemove(function(e){
            let affin_info = get_affinmat('drag',e,gX,gY,gWidth,gHeight,anchorX,anchorY,click_dTx,click_dTy);
            let affin_mat = affin_info.affine_mat;
            click_dTx = affin_info.dTx;
            click_dTy = affin_info.dTy;
            update_editgroup(affin_mat , "drag");
          });
        })
        this.attr({'cursor':'pointer'});
      }
    })
    SVG.get('handle_group').mouseover(function() {
      edit_mousedown_up("off");
    })
    draw.select(selector).mouseout(function(){
      let font_strokewidth = ($('input[name="braillefont"]:checked').val()==='IBfont') ? String(PATH_STROKE_WIDTH * 0.25) : '';
      let font_strokecolor = ($('input[name="braillefont"]:checked').val()==='IBfont') ? '#000000' : 'none';
      edit_mousedown_up();
      if(!this.hasClass('edit_select')){
        if(this.hasClass('image')){
          draw.select('.image_FrameRect').each(function(i,children){
            this.remove();
          })
        }else if(this.hasClass('braille')){  //text要素の場合
          this.attr({
            'stroke-width': font_strokewidth
          });
        }
        this.off('mousedown');
        this.attr({'cursor':'default'});
      }
    })
    SVG.get('handle_group').mouseout(function() {
      edit_mousedown_up();
    })
  }
}

/******************************************************
//edit_selectを解除する関数
******************************************************/
function edit_clear(clear_flag){
  SVG.get('handle_group').hide();
  if($('#rb_width').is(':focus')) update_widthBox();
  if($('#rb_height').is(':focus')) update_heightBox();
  if($('#textInfo_TextBox').is(':focus')) update_TextInfoBox();
  draw.select('.edit_select').each(function(i, children) {
    this.removeClass('edit_select'); //edit_selectクラスを取り除く
    if(!clear_flag) editselect_array.length = 0;
  })
}

function upload_handle(){
  $('#rb_width').off('focusout').on('focusout' , update_widthBox);
  $('#rb_height').off('focusout').on('focusout' , update_heightBox);
  $('#textInfo_TextBox').off('focusout').on('focusout' , update_TextInfoBox);

  (draw.select('.edit_select.ink').first()!==undefined) ? $('.resizeInk_gadget').show() : $('.resizeInk_gadget').hide();
  (draw.select('.edit_select.braille').first()!==undefined) ? $('.resizeBraille_gadget').show() : $('.resizeBraille_gadget').hide();
  (draw.select('.edit_select.path , .edit_select.circle').first()!==undefined) ? $('.stroke_option').show() : $('.stroke_option').hide();
  (draw.select('.edit_select.image').first()!==undefined) ? $('.gadget_imageOpacity').show() : $('.gadget_imageOpacity').hide();

  //文字の内容変更用
  if(draw.select('.edit_select.ink,.edit_select.braille').members.length===1){
    $('.textInfo_gadget').show();
    let text = draw.select('.edit_select.ink,.edit_select.braille').first();
    let text_type , text_value;
    text.hasClass('ink') ? text_type = 'ink' : text_type = 'braille';
    text.hasClass('ink') ? text_value = text.text() : text_value = text.attr('brailleorigintext');
    $('#textInfo_TextBox').val(text_value);
  }else{
    $('.textInfo_gadget').hide();
  }

  if(draw.select('.edit_select').first()===undefined){
    SVG.get('handle_group').hide();　//移動、サイズ変更、回転用のハンドルを非表示
    $('#layer_select').hide();
    $('#fill_change').hide();
  }else{
    SVG.get('handle_group').show();　//移動、サイズ変更、回転用のハンドルを表示
    SVG.get('handle_group').front();

    $('#layer_select').show();
    $('#fill_change').hide();
    if(draw.select('.edit_select.connected , .edit_select.circle').first()) $('#fill_change').show();



    var point1 = new Array() , point2 = new Array();  //affin変換行列作成に使う行列
    for(var i=0;i<3;i++){
      point1[i] = new Array();
      point2[i] = new Array();
    }

    var gmin_x = 1000000 ,  gmin_y = 1000000;
    var gmax_x = -1000000 , gmax_y = -1000000;

    draw.select('.edit_select').each(function(i , children){
      var bbox = get_bbox(this);
      //ハンドル位置の4隅の座標を更新する
      if(gmin_x > bbox.min_x) gmin_x = bbox.min_x;
      if(gmin_y > bbox.min_y) gmin_y = bbox.min_y;
      if(gmax_x < bbox.max_x) gmax_x = bbox.max_x;
      if(gmax_y < bbox.max_y) gmax_y = bbox.max_y;
    })

    //各ハンドルとなる要素を取得
    // box: 移動 , t : 上部 , l:左部 , b:下部 , r:右部
    // lt : 上左部 , rt:上右部 , lb:下左部 , rb:下右部  , rot:回転
    var box_resize = SVG.get('box_resize').show();
    var t_resize = SVG.get('t_resize').show(); //t:
    var l_resize = SVG.get('l_resize').show();
    var b_resize = SVG.get('b_resize').show();
    var r_resize = SVG.get('r_resize').show();
    var lt_resize = SVG.get('lt_resize').show();
    var rt_resize = SVG.get('rt_resize').show();
    var lb_resize = SVG.get('lb_resize').show();
    var rb_resize = SVG.get('rb_resize').show();
    var rot_resize = SVG.get('rot_resize').show();

    //ハンドル位置の4隅の座標を決定
    gX = gmin_x　, gY = gmin_y;
    gWidth = gmax_x-gmin_x , gHeight = gmax_y-gmin_y;
    if(gWidth < 0.001 || gHeight < 0.001){
      lt_resize.hide();
      rt_resize.hide();
      lb_resize.hide();
      rb_resize.hide();
    }
    if(gWidth<0.001){
      gX = gX -2.5;
      gWidth = 5;
    }
    if(gHeight<0.001){
      gY = gY -2.5;
      gHeight = 5;
    }


    change_gX = gmin_x　, change_gY = gmin_y;
    change_gWidth = gmax_x-gmin_x , change_gHeight = gmax_y-gmin_y;

    var dTx = 0 , dTy = 0;
    var cx = 0 , cy = 0;
    var anchorX = 0 , anchorY = 0;
    var rad = 0 , deg = 0; //回転操作時の角度

    //ハンドル位置の更新
    SVG.get('handle_group').attr({'transform' : ''});
    box_resize.attr({
      'x' : gX,
      'y' : gY,
      'width' : gWidth,
      'height' : gHeight,
      'transform':''
    });
    t_resize.attr({
      'cx' : gX+gWidth/2,
      'cy' : gY,
      'r' : HANDLE_CIRCLE_RADIUS/(2*draw.viewbox().zoom)
    });
    l_resize.attr({
      'cx':gX,
      'cy':gY + gHeight/2,
      'r' : HANDLE_CIRCLE_RADIUS/(2*draw.viewbox().zoom)
    })
    b_resize.attr({
      'cx':gX + gWidth/2,
      'cy':gY + gHeight,
      'r' : HANDLE_CIRCLE_RADIUS/(2*draw.viewbox().zoom)
    })
    r_resize.attr({
      'cx':gX + gWidth,
      'cy':gY + gHeight/2,
      'r' : HANDLE_CIRCLE_RADIUS/(2*draw.viewbox().zoom)
    })
    lt_resize.attr({
      'cx':gX,
      'cy':gY,
      'r' : HANDLE_CIRCLE_RADIUS/(2*draw.viewbox().zoom)
    })
    rt_resize.attr({
      'cx' : gX + gWidth,
      'cy' : gY,
      'r' : HANDLE_CIRCLE_RADIUS/(2*draw.viewbox().zoom)
    })
    lb_resize.attr({
      'cx' : gX,
      'cy' : gY + gHeight,
      'r' : HANDLE_CIRCLE_RADIUS/(2*draw.viewbox().zoom)
    })
    rb_resize.attr({
      'cx' : gX + gWidth,
      'cy' : gY + gHeight,
      'r' : HANDLE_CIRCLE_RADIUS/(2*draw.viewbox().zoom)
    })
    rot_resize.attr({
      'cx' : gX + gWidth/2,
      'cy' : gY - 15/draw.viewbox().zoom,
      'r' : HANDLE_CIRCLE_RADIUS/(2*draw.viewbox().zoom)
    })


    //幅、高さのテキストボックスに値を入力
    $('#rb_width').val(Math.round( gWidth/SVG_RATIO * Math.pow( 10 , 2 ) ) / (Math.pow( 10 , 2 ) ) );
    $('#rb_height').val(Math.round( gHeight/SVG_RATIO * Math.pow( 10 , 2 ) ) / (Math.pow( 10 , 2 ) ) );

    //box_resizeのマウスドラッグでの平行移動
    box_resize.off('mousedown').mousedown(function(e){
      if(e.button===0){
        anchorX = getmousepoint('normal',e).x , anchorY = getmousepoint('normal',e).y;
        $(document).off('mousemove').mousemove(function(e){
          let affin_info = get_affinmat('drag',e,gX,gY,gWidth,gHeight,anchorX,anchorY,dTx,dTy);
          let affin_mat = affin_info.affine_mat;
          dTx = affin_info.dTx;
          dTy = affin_info.dTy;
          update_editgroup(affin_mat , "drag");
        });
      }
    });

    //top handle
    t_resize.off('mousedown').mousedown(function(e){
      if(e.button===0){
        anchorX = getmousepoint('normal',e).x , anchorY = getmousepoint('normal',e).y;
        $(document).off('mousemove').mousemove(function(e){
          let affin_info = get_affinmat('top',e,gX,gY,gWidth,gHeight,anchorX,anchorY,dTx,dTy);
          let affin_mat = affin_info.affine_mat;
          dTx = affin_info.dTx;
          dTy = affin_info.dTy;
          update_editgroup(affin_mat , 'top');
        });
      }
    });

    //left handle
    l_resize.off('mousedown').mousedown(function(e){
      if(e.button===0){
        anchorX = getmousepoint('normal',e).x , anchorY = getmousepoint('normal',e).y;
        $(document).off('mousemove').mousemove(function(e){
          let affin_info = get_affinmat('left',e,gX,gY,gWidth,gHeight,anchorX,anchorY,dTx,dTy);
          let affin_mat = affin_info.affine_mat;
          dTx = affin_info.dTx;
          dTy = affin_info.dTy;
          update_editgroup(affin_mat , 'left');
        });
      }
    });

    //bottom handle
    b_resize.off('mousedown').mousedown(function(e){
      if(e.button===0){
        anchorX = getmousepoint('normal',e).x , anchorY = getmousepoint('normal',e).y;
        $(document).off('mousemove').mousemove(function(e){
          let affin_info = get_affinmat('bottom',e,gX,gY,gWidth,gHeight,anchorX,anchorY,dTx,dTy);
          let affin_mat = affin_info.affine_mat;
          dTx = affin_info.dTx;
          dTy = affin_info.dTy;
          update_editgroup(affin_mat , 'bottom');
        });
      }
    });

    //right handle
    r_resize.off('mousedown').mousedown(function(e){
      if(e.button===0){
        anchorX = getmousepoint('normal',e).x , anchorY = getmousepoint('normal',e).y;
        $(document).off('mousemove').mousemove(function(e){
          let affin_info = get_affinmat('right',e,gX,gY,gWidth,gHeight,anchorX,anchorY,dTx,dTy);
          let affin_mat = affin_info.affine_mat;
          dTx = affin_info.dTx;
          dTy = affin_info.dTy;
          update_editgroup(affin_mat , 'right');
        });
      }
    });

    //left-top handle
    lt_resize.off('mousedown').mousedown(function(e){
      if(e.button===0){
        anchorX = getmousepoint('normal',e).x , anchorY = getmousepoint('normal',e).y;
        $(document).off('mousemove').mousemove(function(e){
          let affin_info = get_affinmat('left_top',e,gX,gY,gWidth,gHeight,anchorX,anchorY,dTx,dTy);
          let affin_mat = affin_info.affine_mat;
          dTx = affin_info.dTx;
          dTy = affin_info.dTy;
          update_editgroup(affin_mat , 'left_top');
        });
      }
    });

    //right-top handle
    rt_resize.off('mousedown').mousedown(function(e){
      if(e.button===0){
        anchorX = getmousepoint('normal',e).x , anchorY = getmousepoint('normal',e).y;
        $(document).off('mousemove').mousemove(function(e){
          let affin_info = get_affinmat('right_top',e,gX,gY,gWidth,gHeight,anchorX,anchorY,dTx,dTy);
          let affin_mat = affin_info.affine_mat;
          dTx = affin_info.dTx;
          dTy = affin_info.dTy;
          update_editgroup(affin_mat , 'right_top');
        });
      }
    });

    //left-bottom handle
    lb_resize.off('mousedown').mousedown(function(e){
      if(e.button===0){
        anchorX = getmousepoint('normal',e).x , anchorY = getmousepoint('normal',e).y;
        $(document).off('mousemove').mousemove(function(e){
          let affin_info = get_affinmat('left_bottom',e,gX,gY,gWidth,gHeight,anchorX,anchorY,dTx,dTy);
          let affin_mat = affin_info.affine_mat;
          dTx = affin_info.dTx;
          dTy = affin_info.dTy;
          update_editgroup(affin_mat , 'left_bottom');
        });
      }
    });

    //right-bottom handle
    rb_resize.off('mousedown').mousedown(function(e){
      if(e.button===0){
        anchorX = getmousepoint('normal',e).x , anchorY = getmousepoint('normal',e).y;
        $(document).off('mousemove').mousemove(function(e){
          let affin_info = get_affinmat('right_bottom',e,gX,gY,gWidth,gHeight,anchorX,anchorY,dTx,dTy);
          let affin_mat = affin_info.affine_mat;
          dTx = affin_info.dTx;
          dTy = affin_info.dTy;
          update_editgroup(affin_mat , 'right_bottom');
        });
      }
    });

    //rot handle
    rot_resize.off('mousedown').mousedown(function(e){
      if(e.button===0){
        cx = Number($('#box_resize').attr("x")) + Number($('#box_resize').attr("width"))/2;
        cy = Number($('#box_resize').attr("y")) + Number($('#box_resize').attr("height"))/2;
        $(document).off('mousemove').mousemove(function(e){
          let affin_info = get_affinmat('rot',e,gX,gY,gWidth,gHeight,cx,cy,rad);
          let affin_mat = affin_info.affine_mat;
          rad = affin_info.rad;
          deg = affin_info.deg;
          update_editgroup(affin_mat , 'rot');
        });
      }
    });
  }
}

function get_affinmat(type,event,gX,gY,gWidth,gHeight,anchorX,anchorY,dTx,dTy){
  now_movingFlag = true;
  let obj = new Object();
  var point1 = new Array() , point2 = new Array(); //affin変換行列作成に使う行列
  for(var i=0;i<3;i++){
    point1[i] = new Array();
    point2[i] = new Array();
  }

  if(type==='rot'){
    let cx = anchorX , cy = anchorY;
    let rad = dTx;
    var px1 = (gX - cx)*Math.cos(rad) - (gY - cy)*Math.sin(rad) + cx;
    var py1 = (gX - cx)*Math.sin(rad) + (gY - cy)*Math.cos(rad) + cy;
    var px2 = (gX + gWidth - cx)*Math.cos(rad) - (gY - cy)*Math.sin(rad) + cx;
    var py2 = (gX + gWidth - cx)*Math.sin(rad) + (gY - cy)*Math.cos(rad) + cy;
    var px3 = (gX - cx)*Math.cos(rad) - (gY + gHeight- cy)*Math.sin(rad) + cx;
    var py3 = (gX - cx)*Math.sin(rad) + (gY + gHeight - cy)*Math.cos(rad) + cy;
    //変換前の3座標の入力
    point1[0]=[px1,px2,px3];
    point1[1]=[py1,py2,py3];
    point1[2]=[1,1,1];

    mx = getmousepoint('normal',event).x; //描画領域上でのマウスポイント計算
    my = getmousepoint('normal',event).y;
    rad = Math.atan(( Number(my)-cy )/( Number(mx)-cx ));
    if(Number(mx)-cx<0)rad=Math.PI+rad;
    if(input_key_buffer[16] || input_key_buffer[17]){
      rad = Math.PI/2+Math.round(rad / (Math.PI/6)) * Math.PI/6
    }else{
      rad = Math.PI/2+Math.round(rad / (Math.PI/90)) * Math.PI/90
    }
    deg =  rad*180/Math.PI;

    px1 = (gX - cx)*Math.cos(rad) - (gY - cy)*Math.sin(rad) + cx;
    py1 = (gX - cx)*Math.sin(rad) + (gY - cy)*Math.cos(rad) + cy;
    px2 = (gX + gWidth - cx)*Math.cos(rad) - (gY - cy)*Math.sin(rad) + cx;
    py2 = (gX + gWidth - cx)*Math.sin(rad) + (gY - cy)*Math.cos(rad) + cy;
    px3 = (gX - cx)*Math.cos(rad) - (gY + gHeight- cy)*Math.sin(rad) + cx;
    py3 = (gX - cx)*Math.sin(rad) + (gY + gHeight - cy)*Math.cos(rad) + cy;

    //変換後の3座標の入力
    point2[0]=[px1,px2,px3];
    point2[1]=[py1,py2,py3];
    point2[2]=[1,1,1];
    obj.affine_mat = math.multiply(point2 , math.inv(point1));
    obj.rad = rad;
    obj.deg = deg;
    return obj

  }else{
    if(type==='drag'){
      //変換前の3座標の入力
      point1[0]=[gX + dTx , gX + gWidth + dTx , gX + dTx];
      point1[1]=[gY + dTy, gY + dTy , gY + gHeight + dTy];
      point1[2]=[1,1,1];

      dTx = getmousepoint('normal',event).x - anchorX;
      dTy = getmousepoint('normal',event).y - anchorY;
      //変換後の3座標の入力
      point2[0]=[gX + dTx , gX + gWidth + dTx , gX + dTx];
      point2[1]=[gY + dTy, gY +dTy , gY + gHeight + dTy];
      point2[2]=[1,1,1];
    }else if(type==='top'){
      //変換前の3座標の入力
      point1[0]=[gX , gX + gWidth, gX];
      point1[1]=[gY + dTy, gY + dTy , gY + gHeight];
      point1[2]=[1,1,1];

      dTy = getmousepoint('normal',event).y - anchorY;
      if(gHeight <= dTy) dTy = gHeight - 10; //10という数字に大きな意味はなし

      point2[0]=[gX , gX + gWidth, gX];
      point2[1]=[gY + dTy, gY + dTy , gY + gHeight];
      point2[2]=[1,1,1];
    }else if(type==='left'){
      point1[0]=[gX + dTx , gX + gWidth, gX + dTx];
      point1[1]=[gY, gY , gY + gHeight];
      point1[2]=[1,1,1];

      dTx = getmousepoint('normal',event).x - anchorX;
      if(gWidth <= dTx) dTx = gWidth - 10; //10という数字に大きな意味はなし

      //変換後の3座標の入力
      point2[0]=[gX + dTx , gX + gWidth, gX + dTx];
      point2[1]=[gY, gY , gY + gHeight];
      point2[2]=[1,1,1];
    }else if(type==='bottom'){
      point1[0]=[gX , gX + gWidth, gX];
      point1[1]=[gY, gY , gY + gHeight + dTy];
      point1[2]=[1,1,1];

      dTy = getmousepoint('normal',event).y - anchorY;
      if(gHeight + dTy <=  0 ) dTy = -gHeight + 10; //10という数字に大きな意味はなし

      //変換後の3座標の入力
      point2[0]=[gX , gX + gWidth, gX];
      point2[1]=[gY, gY , gY + gHeight + dTy];
      point2[2]=[1,1,1];
    }else if(type==='right'){
      point1[0]=[gX , gX + gWidth + dTx, gX];
      point1[1]=[gY, gY , gY + gHeight];
      point1[2]=[1,1,1];

      dTx = getmousepoint('normal',event).x - anchorX;
      if(gWidth + dTx <= 0) dTx = -gWidth + 10; //10という数字に大きな意味はなし

      //変換後の3座標の入力
      point2[0]=[gX , gX + gWidth + dTx, gX];
      point2[1]=[gY, gY , gY + gHeight];
      point2[2]=[1,1,1];
    }else if(type==='left_top'){
      point1[0]=[gX + dTx , gX + gWidth, gX + dTx];
      point1[1]=[gY + dTy , gY + dTy, gY + gHeight];
      point1[2]=[1,1,1];

      dTx = getmousepoint('normal',event).x - anchorX; //描画領域上でのマウスポイント計算
      dTy = getmousepoint('normal',event).y - anchorY;

      if(gWidth <= dTx) dTx = gWidth - 10; //10という数字に大きな意味はなし
      if(gHeight <= dTy) dTy = gHeight - 10; //10という数字に大きな意味はなし

      if(Math.abs(dTx) > Math.abs(dTy)){
        dTx = dTy*gWidth/gHeight;
      }else{
        dTy = dTx*gHeight/gWidth;
      }

      //変換後の3座標の入力
      point2[0]=[gX + dTx , gX + gWidth, gX + dTx];
      point2[1]=[gY + dTy , gY + dTy, gY + gHeight];
      point2[2]=[1,1,1];

    }else if(type==='right_top'){
      point1[0]=[gX , gX + gWidth + dTx, gX];
      point1[1]=[gY + dTy , gY + dTy, gY + gHeight];
      point1[2]=[1,1,1];

      dTx = getmousepoint('normal',event).x - anchorX; //描画領域上でのマウスポイント計算
      dTy = getmousepoint('normal',event).y - anchorY;

      if(gWidth + dTx <= 0) dTx = -gWidth + 10; //10という数字に大きな意味はなし
      if(gHeight <= dTy) dTy = gHeight - 10; //10という数字に大きな意味はなし

      if(Math.abs(dTx) > Math.abs(dTy)){
        dTx = -dTy*gWidth/gHeight;
      }else{
        dTy = -dTx*gHeight/gWidth;
      }

      //変換後の3座標の入力
      point2[0]=[gX , gX + gWidth + dTx, gX];
      point2[1]=[gY + dTy , gY + dTy, gY + gHeight];
      point2[2]=[1,1,1];

    }else if(type==='left_bottom'){
      point1[0]=[gX + dTx , gX + gWidth, gX + dTx];
      point1[1]=[gY , gY, gY + gHeight + dTy];
      point1[2]=[1,1,1];

      dTx = getmousepoint('normal',event).x - anchorX; //描画領域上でのマウスポイント計算
      dTy = getmousepoint('normal',event).y - anchorY;

      if(gWidth <= dTx) dTx = gWidth - 10; //10という数字に大きな意味はなし
      if(gHeight + dTy <= 0) dTy = -gHeight + 10; //10という数字に大きな意味はなし

      if(Math.abs(dTx) > Math.abs(dTy)){
        dTx = -dTy*gWidth/gHeight;
      }else{
        dTy = -dTx*gHeight/gWidth;
      }

      //変換後の3座標の入力
      point2[0]=[gX + dTx , gX + gWidth, gX + dTx];
      point2[1]=[gY , gY, gY + gHeight + dTy];
      point2[2]=[1,1,1];

    }else if(type==='right_bottom'){
      point1[0]=[gX , gX + gWidth + dTx , gX];
      point1[1]=[gY , gY, gY + gHeight + dTy];
      point1[2]=[1,1,1];

      dTx = getmousepoint('normal',event).x - anchorX; //描画領域上でのマウスポイント計算
      dTy = getmousepoint('normal',event).y - anchorY;

      if(gWidth + dTx <= 0) dTx = -gWidth + 10; //10という数字に大きな意味はなし
      if(gHeight + dTy <= 0) dTy = -gHeight + 10; //10という数字に大きな意味はなし

      if(Math.abs(dTx) > Math.abs(dTy)){
        dTx = dTy*gWidth/gHeight;
      }else{
        dTy = dTx*gHeight/gWidth;
      }

      //変換後の3座標の入力
      point2[0]=[gX , gX + gWidth + dTx , gX];
      point2[1]=[gY , gY, gY + gHeight + dTy];
      point2[2]=[1,1,1];
    }
    obj.affine_mat = math.multiply(point2 , math.inv(point1));
    obj.dTx = dTx;
    obj.dTy = dTy;
    return obj
  }
}


//アフィン変換によるtarget_group内の要素の座標変換
function update_editgroup(affin_mat,scale){
  //SVG.get('handle_group').hide();
  draw.select('.edit_select').each(function(i,children){
    var matrix = this.transform('matrix');
    var trans_matrix = [[matrix.a, matrix.c, matrix.e]
                      ,[matrix.b, matrix.d, matrix.f]
                      ,[0, 0, 1]]
    var trans_matrix = math.multiply(affin_mat , trans_matrix) //座標変換行列をAffin変換
    if(this.hasClass('ink') || this.hasClass('braille')){  //文字要素の場合
      if(scale==="drag" || scale==="rot"){
        this.transform({
          'a': trans_matrix[0][0],'c': trans_matrix[0][1],'b': trans_matrix[1][0],
          'd': trans_matrix[1][1],'e': trans_matrix[0][2],'f': trans_matrix[1][2]
        })
      }
    }else if(this.hasClass('circle')){ //円要素の場合
        var cx = Number( this.attr('cx') ) , cy = Number( this.attr('cy') );
        var cr = Number( this.attr('r') );
        var pos1 = [ [ cx ],[ cy ],[1]];
        switch(scale){
          case 'top':
            var pos2 = [ [ cx  ],[ cy - cr ],[1]];
            break;
          case 'left':
            var pos2 = [ [ cx - cr ],[ cy ],[1]];
            break;
          case 'bottom':
            var pos2 = [ [ cx  ],[ cy + cr ],[1]];
            break;
          case 'right':
            var pos2 = [ [ cx + cr],[ cy ],[1]];
            break;
          default:
            var pos2 = [ [ cx + cr * Math.sin(Math.PI/4) ],[ cy + cr * Math.cos(Math.PI/4) ],[1]]; //pathの座標を格納
            break;
        }
        var pos1 = math.multiply(affin_mat,pos1) , pos2 = math.multiply(affin_mat,pos2); //pathの座標をAffin変
        var new_cr = Math.sqrt( (Number(pos2[0][0])-Number(pos1[0][0])) * (Number(pos2[0][0])-Number(pos1[0][0]))
                                + (Number(pos2[1][0])-Number(pos1[1][0])) * (Number(pos2[1][0])-Number(pos1[1][0])) );

        this.attr({ 'cx' : Number(pos1[0][0]) });
        this.attr({ 'cy' : Number(pos1[1][0]) });
        this.attr({ 'r' : new_cr });
    }else if(this.hasClass('image')){//画像要素の場合
      this.transform({
        'a': trans_matrix[0][0],'c': trans_matrix[0][1],'b': trans_matrix[1][0],
        'd': trans_matrix[1][1],'e': trans_matrix[0][2],'f': trans_matrix[1][2]
      })
    }else{//path要素の場合
      var dpoint_array = this.clear().array().settle(); //pathのdpoint配列を取得
      var new_dpoint = "";
      for(var j=0;j<dpoint_array.length; j++){
        if(dpoint_array[j][0]!=="Z"){  //属性がZ以外の場合
          var pos1 = [ [ dpoint_array[j][1] ],[ dpoint_array[j][2] ],[1]]; //pathの座標を格納
          var trans_matrix = math.multiply(affin_mat,pos1) //pathの座標をAffin変換
          new_dpoint += dpoint_array[j][0]+" "+trans_matrix[0][0]+" "+trans_matrix[1][0]; //新しい座標として格納
        }else{
          new_dpoint += dpoint_array[j][0];
        }
      }
      this.attr({'d':new_dpoint});
    }
  })
  let pos_gXY = [ [ change_gX ],[ change_gY ],[1]]; //座標(gX , gY)
  let pos_gWidHei = [ [ change_gX + change_gWidth ],[ change_gY + change_gHeight],[1]]; //座標(gX + gWidth, gY + Height)
  pos_gXY = math.multiply(affin_mat , pos_gXY);
  pos_gWidHei = math.multiply(affin_mat , pos_gWidHei);

  change_gX = Number(pos_gXY[0][0]), change_gY = Number(pos_gXY[1][0]);
  change_gWidth = Number(pos_gWidHei[0][0]) - change_gX , change_gHeight = Number(pos_gWidHei[1][0]) - change_gY;
  if(change_gWidth<0.001){
    change_gX = change_gX -2.5;
    change_gWidth = 5;
  }
  if(change_gHeight<0.001){
    change_gY = change_gY -2.5;
    change_gHeight = 5;
  }

  //ハンドル位置の更新
  if(scale === "rot"){
    var matrix = SVG.get('handle_group').transform('matrix');
    var trans_matrix = [[matrix.a, matrix.c, matrix.e]
                      ,[matrix.b, matrix.d, matrix.f]
                      ,[0, 0, 1]]
    var trans_matrix = math.multiply(affin_mat , trans_matrix) //座標変換行列をAffin変換
    SVG.get('handle_group').transform({
      'a': trans_matrix[0][0],'c': trans_matrix[0][1],'b': trans_matrix[1][0],
      'd': trans_matrix[1][1],'e': trans_matrix[0][2],'f': trans_matrix[1][2]
    })
  }else{
    SVG.get('box_resize').attr({ 'x' : change_gX, 'y' : change_gY,  'width' : change_gWidth,  'height' : change_gHeight });
    SVG.get('t_resize').attr({ 'cx' : change_gX + change_gWidth/2, 'cy' : change_gY });
    SVG.get('l_resize').attr({ 'cx': change_gX, 'cy':change_gY + change_gHeight/2 })
    SVG.get('b_resize').attr({ 'cx': change_gX + change_gWidth/2, 'cy':change_gY + change_gHeight })
    SVG.get('r_resize').attr({ 'cx': change_gX + change_gWidth, 'cy': change_gY + change_gHeight/2 })
    SVG.get('lt_resize').attr({'cx':change_gX, 'cy':change_gY })
    SVG.get('rt_resize').attr({'cx' : change_gX + change_gWidth , 'cy' : change_gY })
    SVG.get('lb_resize').attr({'cx' : change_gX, 'cy' : change_gY + change_gHeight })
    SVG.get('rb_resize').attr({'cx' : change_gX + change_gWidth, 'cy' : change_gY + change_gHeight })
    SVG.get('rot_resize').attr({ 'cx' : change_gX + change_gWidth/2, 'cy' : change_gY - 15/draw.viewbox().zoom })
  }
}

/******************************************************
//テキストボックスでサイズを変更する関数
******************************************************/
function update_widthBox(){
  var  self = $('#rb_width');
  if(!self.val().match(/[^0-9\.]/) && self.val()!==0 && String(self.val())!=="\." && String(self.val())!==""){
    var point1 = new Array() , point2 = new Array(); //affin変換行列作成に使う行列
    for(var i=0;i<3;i++){
      point1[i] = new Array();
      point2[i] = new Array();
    }
    var box = SVG.get('box_resize');
    var bx = Number(box.x()) , by = Number(box.y());
    var bwidth = Number(box.width()) , bheight = Number(box.height());
    var new_bwidth = Number(self.val()) * SVG_RATIO;
    var new_bheight = new_bwidth * bheight/bwidth;
    point1[0]=[bx + bwidth, bx , bx + bwidth];
    point1[1]=[by,by + bheight,  by + bheight];
    point1[2]=[1,1,1];
    //変換後の3座標の入力
    point2[0]=[bx + new_bwidth , bx ,bx + new_bwidth];
    point2[1]=[by , by + new_bheight , by + new_bheight];
    point2[2]=[1,1,1];
    var affin_mat = math.multiply(point2 , math.inv(point1));
    update_editgroup(affin_mat);
    upload_handle();
  }
}
function update_heightBox(){
  var  self = $('#rb_height');
  if(!self.val().match(/[^0-9\.]/) && self.val()!==0 && String(self.val())!=="\." && String(self.val())!==""){
    var point1 = new Array() , point2 = new Array(); //affin変換行列作成に使う行列
    for(var i=0;i<3;i++){
      point1[i]=new Array();
      point2[i]=new Array();
    }

    var box = SVG.get('box_resize');
    var bx = Number(box.x()) , by = Number(box.y());
    var bwidth = Number(box.width()) , bheight = Number(box.height());
    var new_bheight = Number(self.val()) * SVG_RATIO;
    var new_bwidth = new_bheight * bwidth/bheight;

    point1[0]=[bx + bwidth, bx , bx + bwidth];
    point1[1]=[by,by + bheight,  by + bheight];
    point1[2]=[1,1,1];
    //変換後の3座標の入力
    point2[0]=[bx + new_bwidth , bx ,bx + new_bwidth];
    point2[1]=[by , by + new_bheight , by + new_bheight];
    point2[2]=[1,1,1];
    var affin_mat = math.multiply(point2 , math.inv(point1));
    update_editgroup(affin_mat,"left_top");
    upload_handle();
  }
}

function update_TextInfoBox(){
  if(draw.select('.edit_select.ink,.edit_select.braille').members.length===1){
    let text = draw.select('.edit_select.ink,.edit_select.braille').first();
    let text_type , text_value = $('#textInfo_TextBox').val();
    text.hasClass('ink') ? text_type = 'ink' : text_type = 'braille';
    if(text.hasClass('ink')){
      text.plain(text_value);
    }else{
      let transed_BraText = text_value.replace(/[ァ-ン]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0x60);
      });
      text.plain(tactileGraphic().convertText(transed_BraText));//文字を点字表現に変換
      text.attr({'brailleorigintext' : transed_BraText});
    }
  }
}


//要素が占める領域（四角）の４点を取得
function get_bbox(tg_element){
  var pmin_x = 10000000 , pmax_x = -10000000;
  var pmin_y = 10000000 , pmax_y = -10000000;
  var matrix = tg_element.transform('matrix')
  var trans_matrix = [[matrix.a, matrix.c, matrix.e]
                    ,[matrix.b, matrix.d, matrix.f]
                    ,[0, 0, 1]];
  if(tg_element.hasClass('path')){
    var dpoint = tg_element.clear().array().settle(); //pathのdpoint配列を取得
    for(var j=0; j < dpoint.length; j++){
      if(dpoint[j][0] !== 'Z'){
        if(pmin_x > Number( dpoint[j][1]))pmin_x = Number( dpoint[j][1]);
        if(pmax_x < Number( dpoint[j][1]))pmax_x = Number( dpoint[j][1]);
        if(pmin_y > Number( dpoint[j][2]))pmin_y = Number( dpoint[j][2]);
        if(pmax_y < Number( dpoint[j][2]))pmax_y = Number( dpoint[j][2]);
      }
    }
  }else if(tg_element.hasClass('circle')){
    pmin_x = Number(tg_element.attr('cx')) - Number(tg_element.attr('r'));
    pmax_x = Number(tg_element.attr('cx')) + Number(tg_element.attr('r'));
    pmin_y = Number(tg_element.attr('cy')) - Number(tg_element.attr('r'));
    pmax_y = Number(tg_element.attr('cy')) + Number(tg_element.attr('r'));
  }else if(tg_element.hasClass('ink')){ //text要素
    pmin_x = Number(tg_element.attr('x'));
    pmax_x = Number(tg_element.attr('x')) + Number(tg_element.bbox().width);
    pmin_y = Number(tg_element.attr('y')) - Number(tg_element.bbox().height)/2;
    pmax_y = Number(tg_element.attr('y'));
  }else if(tg_element.hasClass('braille')){ //braille
    var corre_braille = tg_element.attr('font-size')/4; //点字が占めるエリア領域の補正量 : ikarashi braille がデフォルトでそういう仕様になっている
    pmin_x = Number(tg_element.attr('x')) + corre_braille;
    pmax_x = Number(tg_element.attr('x')) + Number(tg_element.bbox().width) - corre_braille;
    pmin_y = Number(tg_element.attr('y')) - Number(tg_element.bbox().height);
    pmax_y = Number(tg_element.attr('y'));
  }else if(tg_element.hasClass('image')){
    pmin_x = Number(tg_element.attr('x'));
    pmax_x = Number(tg_element.attr('x')) + Number(tg_element.bbox().width);
    pmin_y = Number(tg_element.attr('y'));
    pmax_y = Number(tg_element.attr('y')) + Number(tg_element.bbox().height);

  }else{
    pmin_x = Number(tg_element.attr('x'));
    pmax_x = Number(tg_element.attr('x')) + Number(tg_element.bbox().width);
    pmin_y = Number(tg_element.attr('y'))
    pmax_y = Number(tg_element.attr('y')) + Number(tg_element.bbox().height);
  }
  var position1 = [ [ pmin_x ],[ pmin_y ],[1]];
  var position2 = [ [ pmax_x ],[ pmin_y ],[1]];
  var position3 = [ [ pmin_x ],[ pmax_y ],[1]];
  var position4 = [ [ pmax_x ],[ pmax_y ],[1]];

  var trans1 = math.multiply(trans_matrix , position1);
  var trans2 = math.multiply(trans_matrix , position2);
  var trans3 = math.multiply(trans_matrix , position3);
  var trans4 = math.multiply(trans_matrix , position4);

  pmin_x = Math.min( trans1[0][0], trans2[0][0] , trans3[0][0] , trans4[0][0]);
  pmax_x = Math.max( trans1[0][0], trans2[0][0] , trans3[0][0] , trans4[0][0]);
  pmin_y = Math.min( trans1[1][0], trans2[1][0] , trans3[1][0] , trans4[1][0]);
  pmax_y = Math.max( trans1[1][0], trans2[1][0] , trans3[1][0] , trans4[1][0]);

  var bbox = new Object();
  bbox.min_x = pmin_x , bbox.max_x = pmax_x;
  bbox.min_y = pmin_y , bbox.max_y = pmax_y;
  return bbox;
}




function copy_select(){
  copy_elements.length = 0;
  draw.select('.edit_select').each(function(i, children){
    copy_elements.unshift(this);
  })
}

function paste_select(){
  if(copy_elements.length > 0) edit_clear();
  for(let i=0;i < copy_elements.length; i++){
    let clone = copy_elements[i].clone().addClass('edit_select');
    clone.dmove(100);
    if($('input[name="tg_mode"]:checked').val()==='Edit') clone.off('mousedown');
  }
  if(copy_elements.length > 0){
    copy_select();
    let current_mode = $('input[name="tg_mode"]:checked').val();
    if(current_mode==='Edit' || current_mode ==='EditImage'){
      upload_handle();
      set_textsize();
      set_strokewidth();
      set_strokecolor();
      set_fillcolor();
      set_imageOpacity();
    }else{
      draw.select('.edit_select').removeClass('edit_select');
    }
    cash_svg();
  }
}

function delete_select(){
  let delete_flag = false;
  draw.select('.edit_select').each(function(i, children){
    this.remove();
    delete_flag = true;
  })
  if(delete_flag) cash_svg();
  edit_clear();
  edit_hover();
  edit_mousedown_up();
}

function set_handle(){
  if(SVG.get('handle_group')!==null)SVG.get('handle_group').remove();
  var handle_group =  draw.group().attr({'id':'handle_group'});
  handle_group.hide();

  handle_group.add(draw.rect(0,0).attr({
    'id':'box_resize',
    'class':'handle',
    'cursor':'move',
    'stroke-width': 2,
    'fill': 'gray',
    'stroke-dasharray': '5 5',
    'stroke': 'black',
	  'stroke-opacity': 0.8,
	  'fill-opacity': 0.1
  }))

  handle_group.add(draw.circle(HANDLE_CIRCLE_RADIUS).attr({
      'fill':'black',
      'id':'t_resize',
      'class':'handle',
      'cursor': 'n-resize',
  }))
  handle_group.add(draw.circle(HANDLE_CIRCLE_RADIUS).attr({
    'fill':'black',
    'id':'l_resize',
    'class':'handle',
    'cursor': 'e-resize'
  }))
  handle_group.add(draw.circle(HANDLE_CIRCLE_RADIUS).attr({
    'fill':'black',
    'id':'b_resize',
    'class':'handle',
    'cursor': 's-resize',
  }))
  handle_group.add(draw.circle(HANDLE_CIRCLE_RADIUS).attr({
    'fill':'black',
    'id':'r_resize',
    'class':'handle',
    'cursor': 'w-resize',
  }))
  handle_group.add(draw.circle(HANDLE_CIRCLE_RADIUS).attr({
    'fill':'black',
    'id':'lt_resize',
    'class':'handle',
    'cursor': 'nw-resize',
  }))
  handle_group.add(draw.circle(HANDLE_CIRCLE_RADIUS).attr({
    'fill':'black',
    'id':'rt_resize',
    'class':'handle',
    'cursor': 'ne-resize',
  }))
  handle_group.add(draw.circle(HANDLE_CIRCLE_RADIUS).attr({
    'fill':'black',
    'id':'lb_resize',
    'class':'handle',
    'cursor': 'sw-resize',
  }))
  handle_group.add(draw.circle(HANDLE_CIRCLE_RADIUS).attr({
    'fill':'black',
    'id':'rb_resize',
    'class':'handle',
    'cursor': 'se-resize',
  }))
  handle_group.add(draw.circle(HANDLE_CIRCLE_RADIUS).attr({
    'stroke':'black',
    'fill':'white',
    'id':'rot_resize',
    'class':'handle',
    'cursor': 'pointer'
  }))
}
