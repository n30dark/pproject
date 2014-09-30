<?php
/**
 * Philips Sonicare Brush Microsite - Born05
 *
 * Index Controller
 *
 * This is the controller for the Inde  x
 *
 * @author    Sergio Paulino <sergio@netants.nl>
 * @link      http://www.born05.nl
 * @copyright Copyright (c) Born05
 * @license   All rights reserved
 */

class IndexController {

    protected $_model;
    protected $_controller;
    protected $_action;
    protected $_view;
    protected $_modelBaseName;

    public function __construct($model, $action)
    {
        $this->_controller = ucwords(__CLASS__);
        $this->_action = $action;
        $this->_modelBaseName = $model;

        $this->_view = new View(HOME . DS . 'views' . DS . strtolower($this->_modelBaseName) . DS . $action . '.phtml');
    }

    protected function _setModel($modelName)
    {
        $modelName .= 'Model';
        $this->_model = new $modelName();
    }

    protected function _setView($viewName)
    {
        $this->_view = new View(HOME . DS . 'views' . DS . strtolower($this->_modelBaseName) . DS . $viewName . '.phtml');
    }

    public function index() {

        try{
            $brushes = $this->getAllBrushes();
            $this->_view->set('brushes', $brushes);
            $this->_view->set('jsonBrushes', json_encode($brushes));

            return $this->_view->output();

        } catch (Exception $e) {
            echo "Application error: " . $e->getMessage();
        }

    }

    /* Brush related functions  */

    public function getAllBrushes(){

        $brushes = array();

        //run through all Json in the json folder
        $path =  getcwd() . DS . "content" . DS . "json" . DS . "NL" . DS . "brush" . DS;

        if (scandir($path)) {
            if ($dh = opendir($path)) {
                //foreach file, getBrush(filename)
                while (($file = readdir($dh)) !== false ) {
                    if ($file != "." && $file != ".." && $file != ".AppleDouble" && $file != ".DS_Store") {
                        $aux = explode(".", $file);
                        $brushId = $aux[0];
                        $brushes[] = $this->getBrush($brushId);
                    }
                }
            }
        }

        //return json with brushes
        return $brushes;

    }

    public function getBrush($brushId){

        //get brush from json folder (brushID should be the same as the filename, minus ".json")
        $json = file_get_contents(getcwd() . DS . "content" . DS . "json" . DS . "NL" . DS . "brush" . DS . $brushId . ".json");
        $brush = new \BrushModel($json);

        //$this->getCompatibleBrushes($brushId)
        $compatibleBrushes = array();
        foreach($brush->compatibleBrushHeads as $compatible) {
            if(file_exists(getcwd() . DS . "content" . DS . "json" . DS . "NL" . DS . "brushHead" . DS . $compatible . ".json")){
                $compatibleBrushes[] = $this->getBrushHead($compatible);
            }
        }
        $brush->compatibleBrushHeads = $compatibleBrushes;

        if($_GET["preferred"] == $brushId) {
            $brush->preferred = 1;
        }

        //return brush object
        return $brush;

    }

    public function getBrushHead($brushHeadId) {

        //get brushhead from json folder (brushHeadID should be the same as the filename, minus ".json")
        $json = file_get_contents(getcwd() . DS . "content" . DS . "json" . DS . "NL" . DS . "brushHead" . DS . $brushHeadId . ".json");
        $brushHead = new \BrushHeadModel($json);

        //$this->getCompatibleBrushes($brushId)
        $brushPackList = array();
        foreach($brushHead->brushPack as $brushPack) {
            if(file_exists(getcwd() . DS . "content" . DS . "json" . DS . "NL" . DS . "brushPack" . DS . $brushPack . ".json")){
                $brushPackList[] = $this->getBrushPack($brushPack);
            }
        }
        $brushHead->brushPacks = $brushPackList;

        //return brush object
        return $brushHead;

    }

    public function getJsonBrush($brushId) {
        return json_encode($this->getBrush($brushId));
    }

    public function getBrushPack($brushPackId) {

        //get BrushPackModel from json folder (brushId should be the same as the filename, minus ".json")
        $json = file_get_contents(getcwd() . DS . "content" . DS . "json" . DS . "NL" . DS . "brushPack" . DS . $brushPackId . ".json");
        $brushPack  = new \BrushPackModel($json);

        //get retailer for this BrushPack
        $retailerList = array();
        if($_GET["philipsOnly"]) {
            $retailerList[] = $this->getRetailer("philips");
        } else {
            foreach($brushPack->retailers as $retailer) {
                if(file_exists(getcwd() . DS . "content" . DS . "json" . DS . "NL" . DS . "retailer" . DS . $retailer . ".json")){
                    $retailerList[] = $this->getRetailer($retailer);
                }
            }
        }

        $brushPack->retailers = $retailerList;

        //return BrushPackModel
        return $brushPack;
    }

    public function getRetailer($retailerId) {

        //get retailer from json folder (retailerId should be the same as the filename, minus ".json")
        $json = file_get_contents(getcwd() . DS . "content" . DS . "json" . DS . "NL" . DS . "retailer" .DS . $retailerId . ".json");
        $retailer = new \RetailerModel($json);

        //return Retailer Object
        return $retailer;
    }

}
