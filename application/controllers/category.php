<?php

class Category extends CI_Controller
{

	/** @var User_model */
	public $user;
	/** @var Game_model */
	public $game;

	public function __construct()
	{
		parent::__construct();
		$this->load->model('User_model', 'user', TRUE);
		$this->load->model('Game_model', 'game', TRUE);
	}

	public function index()
	{
		jump(base_url());
	}

	public function view($category) {
		$user = $this->user->get_main_user();
		$games_hot = $this->game->search_games(NULL, SORT_HOT);
		$games_new = $this->game->search_games(NULL, SORT_NEW);
		$games_recent = $this->game->get_recent_games(20);

		$tags = $this->game->get_hot_tags(10);

		$messages = array();
		if (($posted = $this->session->userdata('alert'))) {
			$this->session->unset_userdata('alert');
			$messages[] = $posted;
		}

		$meta = new Metaobj();
		$meta->setup_category($category);
		$this->load->view('head', array('meta' => $meta, 'user' => $user));
		$this->load->view('bodywrapper_head');
		$this->load->view('navbar');
		$this->load->view('breadcrumbs', array('list' => array('TOP' => base_url(), 'カテゴリ' => base_url(), Gameobj::to_category_str($category) => TRUE)));
		$this->load->view('title', array('title' => $meta->get_title()));
		$this->load->view('alert', array('messages' => $messages));
		$this->load->view('categorypage', array('games_hot' => $games_hot, 'games_new' => $games_new, 'games_recent' => $games_recent, 'tags' => $tags, 'category' => $category));
		$this->load->view('bodywrapper_foot');
		$this->load->view('footer');
		$this->load->view('foot');
	}

}


