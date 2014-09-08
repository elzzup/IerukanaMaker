<?php

class Rss extends CI_Controller
{

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

	public function category($category_en) {
		$lib = array_flip(unserialize(GAME_CATEGORY_EN_MAP));
		if (!isset($lib[$category_en])) {
			show_404();
		}
		$category = $lib[$category_en];
		// NOTE: とりあえず新着の配信
		$games_new = $this->game->get_games_new($category);
		$channel = new Channelobj();
		$channel->title = str_replace(array('%CATEGORY%'), array(Gameobj::to_category_str($category)), FORMAT_RSS_TITLE_CATEGORY);
		$channel->link = base_url(PATH_RSS_CATEGORY . $category_en);
		$channel->items = Itemobj::to_items($games_new);

		$this->load->view('rss2', array('channel' => $channel));
	}

}



