<?php

class Search extends CI_Controller {

	/** @var User_model */
	public $user;

	/** @var Game_model */
	public $game;

	public function __construct() {
		parent::__construct();
		$this->load->model('User_model', 'user', TRUE);
		$this->load->model('Game_model', 'game', TRUE);
	}

	public function index() {
		$this->main(SORT_HOT);
	}

	public function main($method, $page_index = 0) {
		$q = $this->input->get('q') ? : NULL;
		$games = $this->game->search_games($q, $method, NUM_GAME_PAR_SEARCHPAGE, $page_index * NUM_GAME_PAR_SEARCHPAGE);
		$meta = new Metaobj();
		if (empty($q)) {
			// 検索クエリがない場合は固定ページとして扱う
			switch ($method) {
				case SORT_HOT:
					$meta->set_title('人気の言えるかな？');
					$meta->description = '最近人気のある言えるかな？のリスト';
					break;
				case SORT_NEW:
					$meta->set_title('新着の言えるかな？');
					$meta->description = '最近作られた言えるかな？のリスト';
					break;
				default:
					show_404();
			}
		} else {
			$meta->set_title('検索結果 - ' . $q);
			$meta->description = '言えるかなのキーワード検索結果';
			$meta->no_meta = TRUE;
		}
		$this->_call_views($q, $page_index, $meta, $games);
	}

	private function _call_views($q, $page_index, $meta, $games) {
		$user = $this->user->get_main_user();
		$messages = array();
		if (($posted = $this->session->userdata('alert'))) {
			$this->session->unset_userdata('alert');
			$messages[] = $posted;
		}
		$this->load->view('head', array('meta' => $meta, 'user' => $user));
		$this->load->view('bodywrapper_head');
		$this->load->view('navbar');
		$this->load->view('title', array('title' => $meta->get_title()));
		$this->load->view('alert', array('messages' => $messages));
		$this->load->view('listpage', array('games' => $games, 'page_index' => $page_index, 'q' => $q));
		$this->load->view('bodywrapper_foot');
		$this->load->view('foot');
	}

}