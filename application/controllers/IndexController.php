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

namespace application\controllers;


class IndexController extends Controller{

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
        $path = "/content/json/brush/";
        if (is_dir($path)) {
            if ($dh = opendir($path)) {
                //foreach file, getBrush(filename)
                while (($file = readdir($dh)) !== false ) {
                    $aux = explode(".", $file);
                    $brushId = $aux[0];
                    $brushes[] = $this->getBrush($brushId);
                }
            }
        }

        //return json with brushes
        return $brushes;

    }

    public function getBrush($brushId){

        //get brush from json folder (brushID should be the same as the filename, minus ".json")
        $json = file_get_contents("/content/json/brush/" . $brushId . ".json");
        $brush = new \BrushModel($json);

        //$this->getBrushPackModel($brushId)
        $brush->brushPack = $this->getBrushPack($brushId);

        //$this->getCompatibleBrushes($brushId)
        $brush->compatibleBrushes = $this->getCompatibleBrushes($brushId);

        //$this->getRetailer($brushId)
        $brush->retailers = $this->getRetailers($brushId);

        //return brush object
        return $brush;

    }

    public function getJsonBrush($brushId) {
        return json_encode($this->getBrush($brushId));
    }

    public function getBrushPack($brushId) {

        //get BrushPackModel from json folder (brushId should be the same as the filename, minus ".json")
        $json = file_get_contents("/content/json/brushPack/" . $brushId . ".json");
        $brushPack  = new \BrushPackModel($json);

        //return BrushPackModel
        return $brushPack;
    }

    public function getCompatibleBrushes($brushId) {

        //$this->getBrush($brushId)
        $brush = $this->getBrush($brushId);

        $compatibleBrushes = array();

        //foreach id, getBrush(id)
        foreach($brush->compatibleBrushes as $compatible) {
            $compatibleBrushes[] = $this->getBrush($compatible);
        }

        //return the compatibleBrushes
        return $compatibleBrushes;

    }

    public function getRetailers($brushId) {

        //$this->getBrush($brushId)
        $brush = $this->getBrush($brushId);

        $retailerList = array();

        //foreach Retailer; $this->getRetailer($retailerId)
        foreach($brush->retailers as $retailer) {
            $retailerList[] = $this->getRetailer($retailer);
        }

        //return retailer array
        return $retailerList;

    }

    public function getRetailer($retailerId) {

        //get retailer from json folder (retailerId should be the same as the filename, minus ".json")
        $json = file_get_contents("/content/json/retailer/" . $retailerId . ".json");
        $retailer = new \RetailerModel($json);

        //return Retailer Object
        return $retailer;
    }

} 