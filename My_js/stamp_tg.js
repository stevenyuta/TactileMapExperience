function set_Stampmode(){
  $(document).off(); //ページ上のイベントの削
  draw.off(); //drawのイベント解除
  draw.select('.SVG_Element , .image').off(); //SVG_Elementのイベント解除
  draw.select('.SVG_Element , .image').attr({'cursor':'default'});
  set_key_down_up();
  set_contextMenu();
  reset_dcheck_element();
  set_zoom(); //zoomイベントの開始
  dummy_delete(); //dummyの全削除
  let stamp_checked = $('input[name="tactileSymbol"]:checked').val();

  /** 右メニューを全て一旦隠す**/
  $('#stroke_style').hide(); //線種変更
  $('.strokewidth_gadget').hide(); //線種変更
  $('.resizeInk_gadget').hide(); //墨字サイズ変更
  $('.resizeBraille_gadget').hide(); //点字サイズ変更
  $('.gadget_imageOpacity').hide(); //画像透過度変更
  $('#layer_select').hide(); //レイヤ変更
  $('#fill_change').hide();  //塗りつぶし変更
  $('#resizeBox_textbox').hide(); //リサイズテキストボックス

  switch(stamp_checked){
    case 'Text':
      $('.resizeInk_gadget').show(); //墨字サイズ変更
      $('.resizeBraille_gadget').show(); //点字サイズ変更
      add_text(); //点字、墨字追加モード
      break;
    case 'Stair':
      $('#stroke_style').show(); //線種変更
      $('.strokewidth_gadget').show(); //線種変更
      add_stair();
      break;
    case 'Escalator':
      $('#stroke_style').show(); //線種変更
      $('.strokewidth_gadget').show(); //線種変更
      add_escalator();
      break;
    case 'Arrow':
      $('#stroke_style').show(); //線種変更
      $('.strokewidth_gadget').show(); //線種変更
      add_arrow();
      break;
    case 'Tiket_gate':
      $('#stroke_style').show(); //線種変更
      $('.strokewidth_gadget').show(); //線種変更
      add_Tiket_gate();
      break;
    case 'Reducescale':
      $('#stroke_style').show(); //線種変更
      $('.strokewidth_gadget').show(); //線種変更
      add_reducescale();
      break;
    case 'Room':
      $('#stroke_style').show(); //線種変更
      $('.strokewidth_gadget').show(); //線種変更
      add_Room();
      break;
    case 'double_circle':
      add_Marker('double_circle');
      break;
    case 'diagonal_mark':
      add_Marker('diagonal_mark');
      break;
    case 'polkadot_mark':
      add_Marker('polkadot_mark');
      break;
    case 'gray_mark':
      add_Marker('gray_mark');
      break;
    default:
      break;
  }
}

/******************************************************
//階段記号を追加すする関数
******************************************************/
function add_stair(){
  let back_num = getPathCirclePos();
  let symbol_id;
  draw.off('mousemove').mousemove(function(e){
    dummy_delete();
    mx = getmousepoint('normal',e).x , my = getmousepoint('normal',e).y;//描画領域上でのマウスポイント計算
    let dummy_stair = draw.path().M({x: mx-STAIRS_BX, y: my-STAIRS_BY})
                                 .L({x: mx+STAIRS_BX, y: my})
                                 .L({x: mx-STAIRS_BX, y: my+STAIRS_BY});
    symbol_id = dummy_stair.attr('id');
    dummy_stair.addClass('dummy').back();
    for(let i=0; i< back_num; i++){
      dummy_stair.forward();
    }
    dummy_stair.attr({
      'fill': 'none',
      'stroke': PATH_STROKE_COLOR,
      'stroke-width' : PATH_STROKE_WIDTH*$('#StrokeWidth_TextBox').val(),
    })
  })

  draw.off('mousedown').mousedown(function(e){
    if(e.button===0){
      let real_stair = SVG.get('#' + symbol_id).removeClass('dummy');
      if(real_stair)real_stair.addClass('stair').addClass('symbol').addClass('SVG_Element').addClass('path');
      cash_svg(); //svgデータのcash
    }
  })
}

/******************************************************
//エレベータ記号を追加すする関数
******************************************************/
function add_escalator(){
  let back_num = getPathCirclePos();
  let symbol_id;
  draw.off('mousemove').mousemove(function(e){
    dummy_delete();
    let mx = getmousepoint('normal',e).x , my = getmousepoint('normal',e).y; //描画領域上でのマウスポイント計算
    let back_num = getPathCirclePos();
    let dummy_escalator = draw.path().M({x: mx-STAIRS_BX, y: my-STAIRS_BY})
                                     .L({x: mx+STAIRS_BX, y: my})
                                     .L({x: mx-STAIRS_BX, y: my+STAIRS_BY})
                                     .Z();
    symbol_id = dummy_escalator.attr('id');
    dummy_escalator.addClass('dummy').back();
    for(let i=0; i< back_num; i++){
      dummy_escalator.forward();
    }
    dummy_escalator.attr({
      'fill': 'none',
      'stroke': PATH_STROKE_COLOR,
      'stroke-width' : PATH_STROKE_WIDTH*$('#StrokeWidth_TextBox').val(),
    })
  })
  draw.off('mousedown').mousedown(function(e){
    if(e.button===0){
      let real_escalator = SVG.get('#' + symbol_id).removeClass('dummy');
      if(real_escalator)real_escalator.addClass('escalator').addClass('symbol').addClass('SVG_Element').addClass('path');
      cash_svg(); //svgデータのcash
    }
  })
}

/******************************************************
//矢印記号を追加すする関数
******************************************************/
function add_arrow(){
  let back_num = getPathCirclePos();
  let symbol_id;
  draw.off('mousemove').mousemove(function(e){
    dummy_delete();
    let mx = getmousepoint('normal',e).x , my = getmousepoint('normal',e).y; //描画領域上でのマウスポイント計算
    let back_num = getPathCirclePos();
    let dummy_arrow = draw.path().M({x: mx-18, y: my}).L({x: mx+24,y:my}).L({x: mx, y: my-12}).L({x: mx+24,y:my}).L({x: mx,y:my+12});
    symbol_id = dummy_arrow.attr('id');
    dummy_arrow.addClass('dummy').back();
    for(let i=0; i< back_num; i++){
      dummy_arrow.forward();
    }
    dummy_arrow.attr({
      'fill': 'none',
      'stroke': PATH_STROKE_COLOR,
      'stroke-width' : PATH_STROKE_WIDTH*$('#StrokeWidth_TextBox').val(),
    })
  })

  draw.off('mousedown').mousedown(function(e){
    if(e.button===0){
      let real_arrow = SVG.get('#' + symbol_id).removeClass('dummy');
      if(real_arrow)real_arrow.addClass('arrow').addClass('symbol').addClass('SVG_Element').addClass('path');
      cash_svg(); //svgデータのcash
    }
  })
}

/******************************************************
//改札記号を追加する関数
******************************************************/
function add_Tiket_gate(){
  let back_num = getPathCirclePos();
  let symbol_id = new Array();
  draw.off('mousemove').mousemove(function(e){
    dummy_delete();
    let mx = getmousepoint('normal',e).x , my = getmousepoint('normal',e).y; //描画領域上でのマウスポイント計算
    let back_num = getPathCirclePos();
    let dummy_tiket_gate1 = draw.path().M({x: mx-40, y: my}).L({x: mx-15,y:my}).addClass('dummy').back();
    let dummy_tiket_gate2 = draw.path().M({x: mx-15, y: my-15}).L({x: mx-15,y:my+15}).addClass('dummy').back();
    let dummy_tiket_gate3 = draw.path().M({x: mx, y: my-15}).L({x: mx,y:my+15}).addClass('dummy').back();
    let dummy_tiket_gate4 = draw.path().M({x: mx+15, y: my-15}).L({x: mx+15,y:my+15}).addClass('dummy').back();
    let dummy_tiket_gate5 = draw.path().M({x: mx+15, y: my}).L({x: mx+40,y:my}).addClass('dummy').back();
    symbol_id[0] = dummy_tiket_gate1.attr('id');
    symbol_id[1] = dummy_tiket_gate2.attr('id');
    symbol_id[2] = dummy_tiket_gate3.attr('id');
    symbol_id[3] = dummy_tiket_gate4.attr('id');
    symbol_id[4] = dummy_tiket_gate5.attr('id');
    for(let i=0; i< back_num; i++){
      dummy_tiket_gate1.forward();
      dummy_tiket_gate2.forward();
      dummy_tiket_gate3.forward();
      dummy_tiket_gate4.forward();
      dummy_tiket_gate5.forward();
    }
    draw.select('.dummy').attr({
      'fill': 'none',
      'stroke': PATH_STROKE_COLOR,
      'stroke-width' : PATH_STROKE_WIDTH*$('#StrokeWidth_TextBox').val(),
    })
  })

  draw.off('mousedown').mousedown(function(e){
    if(e.button===0){
      for(let i=0; i < symbol_id.length; i++){
        let real_tiket_gate = SVG.get('#' + symbol_id[i]).removeClass('dummy');
        if(real_tiket_gate)real_tiket_gate.addClass('connected').addClass('SVG_Element').addClass('path');
      }
      cash_svg(); //svgデータのcash
    }
  })
}

/******************************************************
//縮尺記号を追加すする関数
******************************************************/

function add_reducescale(){
  let back_num = getPathCirclePos();
  let symbol_id = new Array();
  draw.off('mousemove').mousemove(function(e){
    dummy_delete();
    let mx = getmousepoint('normal',e).x , my = getmousepoint('normal',e).y; //描画領域上でのマウスポイント計算
    let back_num = getPathCirclePos();
    let dummy_scale = draw.path().M({x: mx-45, y: my}).L({x: mx-45,y:my-15}).L({x: mx-45, y: my+15}).L({x: mx-45,y:my})
                                 .L({x: mx+45, y: my}).L({x: mx+45,y:my-15}).L({x: mx+45, y: my+15}).L({x: mx+45,y:my});
    symbol_id = dummy_scale.attr('id');
    dummy_scale.addClass('dummy').back();
    for(let i=0; i< back_num; i++){
      dummy_scale.forward();
    }
    dummy_scale.attr({
      'fill': 'none',
      'stroke': PATH_STROKE_COLOR,
      'stroke-width' : PATH_STROKE_WIDTH*$('#StrokeWidth_TextBox').val(),
    })
  })

  draw.off('mousedown').mousedown(function(e){
    if(e.button===0){
      let real_scale = SVG.get('#' + symbol_id).removeClass('dummy');
      if(real_scale)real_scale.addClass('scale').addClass('symbol').addClass('SVG_Element').addClass('path');
      cash_svg(); //svgデータのcash
    }
  })
}

/******************************************************
//目盛り枠を追加すする関数
******************************************************/

function add_graduationFrame(){
  if(SVG.get('graduationFrame_group'))SVG.get('graduationFrame_group').remove();
  let back_num = getPathCirclePos();
  let Frame_group = draw.group().id('graduationFrame_group');

  let frame = Frame_group.path().M({x: -F_WIDTH/2, y: -F_HEIGHT/2}).L({x: F_WIDTH/2,y:-F_HEIGHT/2})
                                .L({x: F_WIDTH/2, y: F_HEIGHT/2}).L({x: -F_WIDTH/2, y:F_HEIGHT/2})
                                .Z().addClass('graduationFrame').addClass('path').id('mainFrame').addClass('SVG_Element');
  for(let i=-F_WIDTH/2; i <= F_WIDTH/2; i += F_WIDTH/4){
    Frame_group.path().M({x: i, y: -F_HEIGHT/2}).L({x: i , y:-F_HEIGHT/2 - F_SCALE}).addClass('graduationFrame').addClass('path').addClass('graduation_side').addClass('SVG_Element');
    Frame_group.path().M({x: i, y: F_HEIGHT/2}).L({x: i , y:F_HEIGHT/2 + F_SCALE}).addClass('graduationFrame').addClass('path').addClass('SVG_Element');
  }
  for(let i=-F_HEIGHT/2; i <= F_HEIGHT/1.5; i += F_HEIGHT/3){
    Frame_group.path().M({x: -F_WIDTH/2 , y: i}).L({x: -F_WIDTH/2 - F_SCALE , y:i}).addClass('graduationFrame').addClass('path').addClass('graduation_length').addClass('SVG_Element');
    Frame_group.path().M({x: F_WIDTH/2 , y: i}).L({x: F_WIDTH/2 + F_SCALE , y:i}).addClass('graduationFrame').addClass('path').addClass('SVG_Element');
  }
  Frame_group.back();
  for(let i=0; i< back_num; i++){
    Frame_group.forward();
  }
  draw.select('.graduationFrame').attr({
    'fill' : 'none',
    'stroke-width': PATH_STROKE_WIDTH
  })
  if($('input[name="direction_guide"]:checked' ).val()==='vertical_guide') rotate_graduationFrame();
}

function rotate_graduationFrame(){
  let affin_mat = new Array();
  let mainFrame = SVG.get('#mainFrame');
  if(mainFrame){
    let cx = mainFrame.x() + mainFrame.width()/2;
    let cy = mainFrame.y() + mainFrame.height()/2;
    let theta;
    $('input[name="direction_guide"]:checked' ).val()==='vertical_guide' ? theta = 90*Math.PI/180 : theta = -90*Math.PI/180

    affin_mat[0]=[Math.cos(theta),-Math.sin(theta),cx-cx*Math.cos(theta)+cy*Math.sin(theta)];
    affin_mat[1]=[Math.sin(theta),Math.cos(theta),cy-cx*Math.sin(theta)-cy*Math.cos(theta)];
    affin_mat[2]=[0,0,1];

    draw.select('.graduationFrame').each(function(i,children){
      let dpoint = this.clear().array().settle(); //pathのdpoint配列を取得
      let new_dpoint = "";
      for(var j=0;j<dpoint.length; j++){
        if(dpoint[j][0]!=="Z"){  //属性がZ以外の場合
          let pos = [ [ dpoint[j][1] ],[ dpoint[j][2] ],[1]]; //pathの座標を格納
          var trans_matrix = math.multiply(affin_mat,pos) //pathの座標をAffin変換
          new_dpoint += dpoint[j][0]+" "+trans_matrix[0][0]+" "+trans_matrix[1][0]; //新しい座標として格納
        }else{
          new_dpoint += dpoint[j][0];
        }
      }
      this.attr({'d':new_dpoint});
      if(this.hasClass('graduation_side')){
        this.addClass('graduation_length').removeClass('graduation_side');
      }else if(this.hasClass('graduation_length')){
        this.addClass('graduation_side').removeClass('graduation_length');
      }
    })
  }
  /**
  update_editgroup(affin_mat,"rot");
  **/
}


/******************************************************
//部屋記号を追加する関数
******************************************************/
function add_Room(){
  let back_num = getPathCirclePos();
  let symbol_id = new Array();
  draw.off('mousemove').mousemove(function(e){
    dummy_delete();
    let mx = getmousepoint('normal',e).x , my = getmousepoint('normal',e).y; //描画領域上でのマウスポイント計算
    let back_num = getPathCirclePos();
    let dummy_room1 = draw.path().M({x: mx-40, y: my-30}).L({x: mx-40,y:my+30}).L({x: mx-15,y:my+30}).addClass('dummy').back();
    let dummy_room2 = draw.path().M({x: mx+40, y: my-30}).L({x: mx+40,y:my+30}).L({x: mx+15,y:my+30}).addClass('dummy').back();

    symbol_id[0] = dummy_room1.attr('id');
    symbol_id[1] = dummy_room2.attr('id');

    for(let i=0; i< back_num; i++){
      dummy_room1.forward();
      dummy_room2.forward();
    }
    draw.select('.dummy').attr({
      'fill': 'none',
      'stroke': PATH_STROKE_COLOR,
      'stroke-width' : PATH_STROKE_WIDTH*$('#StrokeWidth_TextBox').val(),
    })
  })

  draw.off('mousedown').mousedown(function(e){
    if(e.button===0){
      for(let i=0; i < symbol_id.length; i++){
        let real_room = SVG.get('#' + symbol_id[i]).removeClass('dummy');
        if(real_room)real_room.addClass('connected').addClass('SVG_Element').addClass('path');
      }
      cash_svg(); //svgデータのcash
    }
  })
}


/******************************************************
//円を生成する関数
******************************************************/
function draw_circle(){
  let sx = 0 , sy = 0;
  let lx = 0 , ly = 0;
  let make_circle;
  draw.off('mousedown').on('mousedown', function(e){
    if(e.button===0){
      //StrokeWidth_TextBoxの値が何もないまたは0の場合はリセットボタンを発火させる
      if($('#StrokeWidth_TextBox').val()==='') $('#resetStrokeWidth_Button').click();
      if($('#StrokeWidth_TextBox').val()==='0' && $('input[name="draw_line_fillRadio"]:checked').val()==='none') $('#resetStrokeWidth_Button').click();
      sx = getmousepoint('normal',e).x , sy = getmousepoint('normal',e).y; //描画領域上でのマウスポイント計算
      let back_num = getPathCirclePos();
      make_circle = draw.circle(0).attr({
        'cx' : sx,
        'cy' : sy,
        'fill': $('input[name="draw_line_fillRadio"]:checked').val(),
        'stroke-width' : PATH_STROKE_WIDTH * $('#StrokeWidth_TextBox').val(),
        'stroke' : '#000000'
      })
      if($('input[name="stroke"]:checked').val()==='dotted_line'){
        make_circle.attr({ 'stroke-dasharray': PATH_STROKE_WIDTH*$('#StrokeWidth_TextBox').val() })
      }
      make_circle.addClass('SVG_Element').addClass('circle').addClass('make_circle').back();
      for(let i=0; i< back_num; i++){
        make_circle.forward();
      }

      draw.off('mousemove').on('mousemove', function(e){
        lx = getmousepoint('normal',e).x , ly = getmousepoint('normal',e).y //描画領域上でのマウスポイント計算
        let radius = Math.sqrt((sx-lx)*(sx-lx) + (sy-ly)*(sy-ly));
        make_circle.attr({ 'r' : radius });
      })

      draw.off('mouseup').on('mouseup', function(e){
        if(e.button===0){
          if(make_circle.attr('r') > 2 * SVG_RATIO){
            make_circle.removeClass('make_circle');
            cash_svg(); //svgデータのcash
          }else{
            make_circle.remove();
          }
          draw.off('mousemove');
        }
      })
    }
  })
}


/******************************************************
//矩形を生成する関数
******************************************************/
function draw_rect(){
  let sx = 0 , sy = 0;
  let lx = 0 , ly = 0;
  let make_path;
  draw.off('mousedown').on('mousedown', function(e){
    if(e.button===0){
      //StrokeWidth_TextBoxの値が何もないまたは0の場合はリセットボタンを発火させる
      if($('#StrokeWidth_TextBox').val()==='') $('#resetStrokeWidth_Button').click();
      if($('#StrokeWidth_TextBox').val()==='0' && $('input[name="draw_line_fillRadio"]:checked').val()==='none') $('#resetStrokeWidth_Button').click();
      sx = getmousepoint('normal',e).x , sy = getmousepoint('normal',e).y; //描画領域上でのマウスポイント計算
      let back_num = getPathCirclePos();
      make_path = draw.path().attr({
        'fill': $('input[name="draw_line_fillRadio"]:checked').val(),
        'stroke-width' : PATH_STROKE_WIDTH * $('#StrokeWidth_TextBox').val(),
        'stroke' : '#000000'
      })
      if($('input[name="stroke"]:checked').val()==='dotted_line'){
        make_path.attr({ 'stroke-dasharray': PATH_STROKE_WIDTH*$('#StrokeWidth_TextBox').val() })
      }
      make_path.addClass('connected').addClass('SVG_Element').addClass('path').back();
      for(let i=0; i< back_num; i++){
        make_path.forward();
      }
      draw.off('mousemove').on('mousemove', function(e){
        lx = getmousepoint('normal',e).x , ly = getmousepoint('normal',e).y //描画領域上でのマウスポイント計算
        if(input_key_buffer[16]){
          console.log(lx-sx , ly-sy)
          if(lx - sx > ly - sy){
            ly = sy + lx - sx;
          }else{
            lx = sx + ly - sy;
          }
        }
        make_path.attr({'d':''})
        if(lx - sx > 3 && ly - sy > 3) make_path.M({x: sx, y: sy}).L({x: lx, y: sy}).L({x: lx, y: ly}).L({x: sx, y: ly}).Z();
      })
      draw.off('mouseup').on('mouseup', function(e){
        if(e.button===0){
          if(make_path.attr('d')===""){
            make_path.remove();
          }else{
            cash_svg(); //svgデータのcash
            draw.off('mousemove');
          }
        }
      })
    }
  })
}

/////////////////
//文字要素関係関数
/////////////////


/******************************************************
//墨字と点字をdraw_areaのマウス位置に入力する関数
******************************************************/
function add_text(){
  if($('#resizeInk_TextBox').val()==='')$('#inksize_resetbutton').click(); //resizeInk_TextBoxの値が何もない場合はリセットボタンを発火させる
  if($('#resizeBraille_TextBox').val()==='')$('#brasize_resetbutton').click(); //resizeBraille_TextBoxの値が何もない場合はリセットボタンを発火させる
  let back_ink_num = getInkPos();
  let ink_id , bra_id;
  draw.mousemove(function(e){
    dummy_delete();
    let mx = getmousepoint('normal',e).x , my = getmousepoint('normal',e).y; //描画領域上でのマウスポイント計算
    if($('#check_ink').prop('checked')){
      let dummy_Ink_text = draw.plain( $("#InkChar").val() );
      dummy_Ink_text.attr({
        'x': mx,
        'y': my,
        'font-family': 'メイリオ',
        'font-size': $('#resizeInk_TextBox').val() * TEXT_CORRECTION,
        'fill': INK_FILL_COLOR,
        'cursor':'default'
      });
      ink_id = dummy_Ink_text.attr('id');
      dummy_Ink_text.addClass('dummy').back();
      for(let i=0; i< back_ink_num; i++){
        dummy_Ink_text.forward();
      }
    }
    if($('#check_bra').prop('checked')){
      let transed_BraText = $("#Braille").val().replace(/[ァ-ン]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0x60);
      });
      let dummy_Bra_text = draw.plain(tactileGraphic().convertText(transed_BraText));//文字を点字表現に変換
      let font_family = ($('input[name="braillefont"]:checked').val()==='IBfont') ? 'Ikarashi Braille' : '点字線なし';
      let font_stroke = ($('input[name="braillefont"]:checked').val()==='IBfont') ? String(PATH_STROKE_WIDTH * 0.25) : '';
      dummy_Bra_text.attr({
        'x': mx
        ,'y': my + 30
        ,'stroke-width' :  font_stroke,
        'font-family': font_family,
        'font-size': $('#resizeBraille_TextBox').val() * TEXT_CORRECTION,
        'brailleorigintext' : transed_BraText,
        'cursor':'default'
      })
      bra_id = dummy_Bra_text.attr('id');
      dummy_Bra_text.addClass('dummy');
    }
  })

  draw.mousedown(function(e){
    if(e.button===0){ //←クリック時
      let real_Ink_text = SVG.get('#' + ink_id) , real_Bra_text = SVG.get('#' + bra_id);
      if(real_Ink_text){
        if(  real_Ink_text.text() ==="" ){
          alert("墨字に何か入力してください。");
          dummy_delete();
          return;
        }
      }
      if(real_Bra_text){
        if(real_Bra_text.text().match(/[^あ-んー濁小大半斜数拗１２３４５６７８９1-9＿\s]/)){
          alert("点字に使用できない文字が含まれています。");
          dummy_delete();
          return;
        }
        if( real_Bra_text.text() ==="" ){
          alert("点字に何か入力してください。");
          dummy_delete();
          return;
        }
      }
      if(real_Ink_text)real_Ink_text.removeClass('dummy').addClass('ink').addClass('SVG_Element');
      if(real_Bra_text)real_Bra_text.removeClass('dummy').addClass('braille').addClass('SVG_Element');
      if(real_Ink_text || real_Bra_text) cash_svg();

      if($('#check_bra').prop('checked') && $('#check_ink').prop('checked')) real_Bra_text.attr({'ink_text' : real_Ink_text.text()});
    }
  })
}


/******************************************************
/墨字の追加すべきレイヤー順番を示す番号を返す関数
1、画像よりも上
2、塗りつぶされたpathよりも上
3、点字よりも下
4、墨字よりも上
5、path、円記号よりも下
の優先順位で配置する
******************************************************/
function getInkPos(){
  let position; //一番低い位置にある要素のpositon番号を格納
  draw.select(".path , .circle").each(function(i , children){
    if(position > this.position() || position === undefined) position = this.position();
  })
  draw.select(".ink").each(function(i , children){
    if(position < this.position() || position === undefined) position = this.position() + 1;
  })
  draw.select(".braille").each(function(i , children){
    if(position > this.position() || position === undefined) position = this.position();
  })
  draw.select('.path:not([fill="none"])').each(function(i , children){
    if(position <= this.position() || position === undefined) position = this.position() + 1;
  })
  draw.select(".image").each(function(i , children){
    if(position < this.position() || position === undefined) position = this.position() + 1;
  })
  if(position === undefined){
    return 0;
  }else{
    return position;
  }
}

/**************************************************************************************
//選択状態の墨字のfont-sizeを取得してテキストボックスとスライダーの値を変更する関数
//選択状態の墨字が存在しない場合は変更なし、または複数存在する場合は空白にする
**********************************************************************************/
function set_textsize(){
  if(draw.select('.edit_select').first()!==null){
    let ink_flag = false, braille_flag = false;  //true: 選択状態の墨字、点字あり false: なし
    let ink_fontsize = false , braille_fontsize = false;  // 墨字、点字のサイズを格納、 false: サイズが違う文字が2つ以上あり
    draw.select('.edit_select').each(function(i,children){
      if(this.hasClass('ink')){
        if(!ink_flag){
          ink_fontsize = this.attr('font-size');
          ink_flag = true;
        }else if(ink_fontsize !== this.attr('font-size')){
          ink_fontsize = false;
        }
      }
      if(this.hasClass('braille')){
        if(!braille_flag){
          braille_fontsize = this.attr('font-size');
          braille_flag = true;
        }else if(braille_fontsize !== this.attr('font-size')){
          braille_fontsize = false;
        }
      }
    });
    if(ink_flag){
      if(!ink_fontsize){
        $('#resizeInk_TextBox').val('')
      }else{
        $("#resizeInk_Slider").slider("value",Math.round(ink_fontsize/(TEXT_CORRECTION) * 10)/10);
        $('#resizeInk_TextBox').val(Math.round(ink_fontsize/(TEXT_CORRECTION) * 10)/10)
      }
    }else{
    }
    if(braille_flag){
      if(!braille_fontsize){
        $('#resizeBraille_TextBox').val('')
      }else{
        $("#resizeBraille_Slider").slider("value",Math.round(braille_fontsize/(TEXT_CORRECTION) * 10)/10);
        $('#resizeBraille_TextBox').val(Math.round(braille_fontsize/(TEXT_CORRECTION) * 10)/10);
      }
    }else{
    }
    return;
  }else{
    return;
  }
}

/******************************************************
pathまたは円記号の追加すべきレイヤー順番を示す番号を返す関数
path（線、触知記号）、または円はレイヤー順で
1、画像よりも上
2、path、円記号よりも上
3、点字よりも下
4、墨字よりも上
の優先順位で配置する
******************************************************/
function getPathCirclePos(){
  let position; //一番低い位置にある要素のpositon番号を格納
  draw.select(".ink").each(function(i , children){
    if(position < this.position() || position === undefined) position = Number(this.position()) + 1;
  })
  draw.select(".braille").each(function(i , children){ //点字で一番下のレイヤーにあるものの順番を取得
    if(position > this.position() || position === undefined) position = this.position();
  })
  draw.select(".path , .circle").each(function(i , children){
    if(position < this.position() || position === undefined) position = this.position() + 1;
  })
  draw.select(".image").each(function(i , children){
    if(position < this.position() || position === undefined) position = Number(this.position()) + 1;
  })
  if(position === undefined){
    return 0;
  }else{
    return position;
  }
}
