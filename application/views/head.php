<?php
/* @var $meta Metaobj */
/* @var $rss_link string */
if (strpos($_SERVER['HTTP_USER_AGENT'], "MSIE 8")) {
	header("X-UA-Compatible: IE=7");
}
?>
<!DOCTYPE HTML>
<html lang="ja">
	<head>
		<meta charset="UTF-8" />
		<?php $this->load->view('meta', array('meta' => $meta)) ?>
		<title><?= $meta->get_title(TRUE) ?></title>
		<meta name="date" content="" />
		<link rel="canonical" href="<?= $meta->url ?>" />
		<link rel="alternate" media="handheld" href="<?= $meta->url ?>" />
		<!-- 評価中 -->
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<link rel="stylesheet" type="text/css" href="<?= URL_YAHOO_RESET_CSS ?>" />
		<link rel="icon" href="favicon.ico" /> 

		<?php if (isset($rss_link)) { ?>
			<link rel="alternate" type="application/rss+xml" title="RSS" href="<?= $rss_link ?>" />
		<?php } ?>

		<!-- Bootstrap -->
		<link rel="stylesheet" href="<?= base_url(PATH_BOOTSTRAP_CSS) ?>" media="screen" />
		<link rel="stylesheet" href="<?= base_url(PATH_BOOTSTRAP_CSS_FA) ?>" media="screen" />
		<link rel="stylesheet" href="<?= base_url(PATH_STYLE_CSS_MAIN) ?>" media="screen" />
		<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
		<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
		<!--[if lt IE 9]> <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script> <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script> <![endif]-->


		<?php
		if (ENVIRONMENT !== ENVIRONMENT_DEVELOPMENT) {
			echo tag_script_js(base_url(PATH_GOOGLE_ANALYTICS_JS));
		}
		?>
	</head>