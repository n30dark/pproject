<?php
define ('DS', DIRECTORY_SEPARATOR );
define ('HOME', dirname(__FILE__) );

ini_set ('display_errors', 0);


require_once HOME . DS . 'utilities' . DS . 'bootstrap.php';


function __autoload($class)
{
    if (file_exists(HOME . DS . 'utilities' . DS . ($class) . '.php'))
    {
        require_once HOME . DS . 'utilities' . DS . ($class) . '.php';
    }
    else if (file_exists(HOME . DS . 'models' . DS . ($class) . '.php'))
    {
        require_once HOME . DS . 'models' . DS . ($class) . '.php';
    }
    else if (file_exists(HOME . DS . 'controllers' . DS . ($class) . '.php'))
    {
        require_once HOME . DS . 'controllers'  . DS . ($class) . '.php';
    }
}