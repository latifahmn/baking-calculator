var app = angular.module('baking-app', []);
app.controller('controller', function($scope) {
	$scope.ingredient = 'Choose ingredients';
	$scope.ingredientList = ['Butter','Brown Sugar','Cocoa Powder','Flour','Icing Sugar','Liquid','Sugar'];

	$scope.units = { 
		cups: {label: 'Cups', unit: 'Cups'},
		oz: {label: 'oz (Ounce)', unit: 'oz'},
		g: {label: 'g (gram)', unit: 'g'}
	};

	$scope.liquidUnits = {
		cups: {label: 'Cups', unit: 'Cups'},
		ml: {label: 'ml', unit: 'ml', liquid: true},
		floz: {label: 'floz (Fluid Ounce)', unit: 'floz', liquid: true}
	};

	$scope.alias = '';
	$scope.frmUnit = 'Units';
	$scope.toUnit = 'Units';	
	$scope.amount = null;
	$scope.result = '';
	$scope.recipeList = {};
	$scope.recipeName = 'MY RECIPE';
	$scope.ingredientIdx = 0; //idx count starts at 1

    $scope.setIngredient = function(e){
    	$scope.ingredient = e;
    	$scope.alias = e;
    	$scope.calculate();
    };

    $scope.setAmount = function(e){
    	$scope.amount = e;
    	$scope.calculate();
    }

    $scope.setFromUnit = function(e){
    	$scope.frmUnit = e;
    	$scope.calculate();
    }

    $scope.setToUnit = function(e){
    	$scope.toUnit = e;
    	$scope.calculate();
    }

    $scope.validateInputs = function(){
    	var f = false;
    	if ($scope.ingredient != 'Choose ingredients' && $scope.frmUnit != 'Units' && $scope.toUnit != 'Units' && $scope.amount != null){
    		f = true;
    	}
    	return f;
    }

    $scope.resetForm = function(){
    	$scope.ingredient = 'Choose ingredients';
		$scope.frmUnit = 'Units';
		$scope.toUnit = 'Units';
		$scope.result = '';
		$scope.amount = null;
    }

    $scope.editLiquid = function(){
    	document.getElementById('ingredient').removeAttribute('readonly');
    	document.getElementById('ingredient').value = '';
    }

    $scope.saveLiquid = function(){
    	document.getElementById('ingredient').setAttribute('readonly','readonly');
    	var l = document.getElementById('ingredient').value;
    	if (l==''){
    		document.getElementById('ingredient').value = $scope.ingredient;
    	} else {
    		$scope.ingredient = l;
    	}
    }

    $scope.addRecipe = function(){
    	$scope.ingredientIdx = $scope.ingredientIdx+1;
    	$scope.recipeList['item_'+$scope.ingredientIdx] = { idx: $scope.ingredientIdx, ingredient: $scope.ingredient, weight: $scope.result};
    }

    $scope.removeRecipe = function(i){
    	delete $scope.recipeList['item_'+i];
    }

    $scope.editRecipeName = function(){
    	document.getElementById('recipeName').removeAttribute('readonly');
    	document.getElementById('recipeName').value = '';
    	document.getElementById('recipeName').focus();
    	document.getElementById('edit-recipe-btn').style.display = 'none';
    	document.getElementById('save-recipe-btn').style.display = 'inline-block';
    }

    $scope.saveRecipeName = function(){
    	var n = document.getElementById('recipeName').value;
    	if ( n!='' && n!=null){
    		$scope.recipeName = n;
    	} else {
    		$scope.recipeName = 'MY RECIPE';
    	}
    	document.getElementById('recipeName').setAttribute('readonly','readonly');
    	document.getElementById('save-recipe-btn').style.display = 'none';
    	document.getElementById('edit-recipe-btn').style.display = 'inline-block';
    }

    $scope.addCustomRecipe = function(){
    	if ($scope.custom!='' && $scope.custom!=null) {
	    	var r = $scope.custom.split(',');
	    	if (r.length == 2){
		    	$scope.result = r[0].trim();
		    	$scope.ingredient = r[1].trim();
		    	$scope.custom = ''; //reset
		    	$scope.addRecipe();
		    }
	    }
    }

    $scope.calculate = function() {
    	if ( $scope.toUnit!='Units' && $scope.frmUnit != 'Units' && $scope.amount != null && $scope.ingredient!='Choose ingredients'){
	    	$scope.result = '0 ' + $scope.toUnit;
	    }
    }

});

