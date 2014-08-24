// Generated by CoffeeScript 1.7.1
(function() {
  $(function() {
    var add_list, all_word_num, btn_end, btn_start, data_start_id, dtime, form, game_end, game_flag, game_start, get_forms, my_disp, post_result, process_count_span, replay, solve_count, start_time, td_boxs, time_box, timer_id, to_double0, wordbox_change, wordbox_clear;
    td_boxs = $('table.words-table td');
    form = $('#answer-form');
    process_count_span = $('span#process_count');
    btn_end = $('#submit-end');
    btn_start = $('#submit-start');
    time_box = $('#time-box');
    all_word_num = td_boxs.size();
    solve_count = 0;
    game_flag = 0;
    dtime = 0;
    start_time = null;
    timer_id = null;
    data_start_id = [];
    btn_end.parent().hide();
    replay = function() {
      var td, word;
      if (game_flag !== 1) {
        return;
      }
      word = form.val();
      td = td_boxs.find("[ans=" + word + "]");
      td = $("td[ans=" + word + "]");
      if (!td || td.hasClass("ok")) {
        return;
      }
      td.html(word);
      td.addClass('ok');
      form.val('');
      data_start_id.push(td.attr('nid'));
      solve_count++;
      process_count_span.html(solve_count);
      if (solve_count === all_word_num) {
        return game_end();
      }
    };
    game_end = function() {
      var ng_ids;
      game_flag = 0;
      clearInterval(timer_id);
      btn_start.parent().show();
      btn_end.parent().hide();
      ng_ids = [];
      td_boxs.not('.ok').each(function() {
        $(this).html($(this).attr('ans'));
        $(this).addClass('ng');
        return ng_ids.push($(this).attr('nid'));
      });
      return post_result(data_start_id, ng_ids);
    };
    game_start = function() {
      game_flag = 1;
      start_time = new Date().getTime();
      btn_start.parent().hide();
      btn_end.parent().show();
      dtime = 0;
      solve_count = 0;
      data_start_id = [];
      process_count_span.html(0);
      td_boxs.each(function() {
        $(this).html("");
        $(this).removeClass('ok');
        return $(this).removeClass('ng');
      });
      return timer_id = setInterval(function() {
        return my_disp();
      }, 1);
    };
    to_double0 = function(n) {
      if (n < 10) {
        return '0' + n;
      }
      return n;
    };
    my_disp = function() {
      var myH, myM, myMS, myS;
      dtime = new Date().getTime() - start_time;
      myH = Math.floor(dtime / (60 * 60 * 1000));
      dtime = dtime - (myH * 60 * 60 * 1000);
      myM = Math.floor(dtime / (60 * 1000));
      dtime = dtime - (myM * 60 * 1000);
      myS = Math.floor(dtime / 1000);
      myMS = Math.floor(dtime / 10 % 100);
      return time_box.html(to_double0(myH) + ":" + to_double0(myM) + ":" + to_double0(myS) + "." + to_double0(myMS));
    };
    btn_start.click(function() {
      return game_start();
    });
    btn_end.click(function() {
      return game_end();
    });
    post_result = function(start_ids, ng_ids) {
      var data;
      console.log(start_ids);
      console.log(ng_ids);
      data = {
        start_ids: start_ids.join(","),
        ng_ids: ng_ids.join(",")
      };
      console.log(data);
      return;
      return $.ajax({
        type: "POST",
        url: "make/post",
        data: data,
        success: function(data) {
          return console.log('result posted');
        },
        error: function() {
          return console.log('result post error');
        }
      });
    };
    form.on("keypress", function(e) {
      if (e.which === 13) {
        return replay();
      }
    });
    $('#submit-answer').click(function() {
      return replay();
    });
    add_list = function() {
      var add_text, add_words;
      add_text = $('#input_add').val();
      add_words = add_text.split(/[,\s]/).filter(function(e) {
        return !!e;
      });
      add_words = $.unique(add_words);
      $(".wordbox").each(function() {
        if (!$(this).val()) {
          $(this).val(add_words.shift());
          if (add_words.length === 0) {
            return false;
          }
        }
      });
      $('#input_add').val("");
      return wordbox_change();
    };
    $('#submit-add').click(add_list);
    $('#input_add').on("keypress", function(e) {
      if (e.which === 13) {
        return add_list();
      }
    });
    get_forms = function() {
      var data, game_description, game_name, wordlist, words_text, words_unit;
      wordlist = [];
      $('.wordbox').each(function() {
        var v;
        v = $.trim($(this).val());
        if (v) {
          return wordlist.push(v);
        }
      });
      words_text = wordlist.join(',');
      game_name = $.trim($('#input_game_name').val());
      words_unit = $.trim($('#input_words_unit').val());
      game_description = $.trim($('#input_description').val());
      if (words_text !== '' && (game_name != null) && (words_unit != null) && game_description) {
        return data = {
          game_name: game_name,
          words_unit: words_unit,
          game_description: game_description,
          words_list_text: words_text
        };
      }
      return false;
    };
    wordbox_change = function() {
      return console.log('changed');
    };
    wordbox_clear = function() {
      return $(".wordbox").each(function() {
        return $(this).val("");
      });
    };
    $('#submit-clear').click(wordbox_clear);
    $('#check-btn').click(function() {
      var gn, ok;
      ok = true;
      if (gn = $.trim($('#input_game_name').val())) {
        gn;
      } else {
        ok = false;
      }
      $('#input_words_unit').val();
      return $('#input_descripiton').val();
    });
    $('#submit-btn').click(function() {
      var data;
      if (!(data = get_forms())) {
        console.log('form no comp');
        return false;
      }
      return $.ajax({
        type: "POST",
        url: "make/post",
        data: data,
        success: function(data) {
          if (data === 'e1') {
            return console.log("ゲーム名が既に使われています");
          } else {
            return location.href = 'g/' + data;
          }
        },
        error: function() {
          return console.log('connect error');
        }
      });
    });
    return $('.wordbox').change(function() {
      return wordbox_change;
    });
  });

}).call(this);
