function toggleDateFields(show) {
    var dateSelection = document.getElementById('date-selection');
    if (show) {
        dateSelection.classList.add('active');
    } else {
        dateSelection.classList.remove('active');
    }
}

document.getElementById('schedule').addEventListener('change', function() {
    toggleDateFields(true);
    updateTotalCost();
});

document.getElementById('immediate').addEventListener('change', function() {
    toggleDateFields(false);
    updateTotalCost();
});

function toggleAddressField() {
    var newAddressField = document.getElementById('new-address');
    if (newAddressField.style.display === 'none') {
        newAddressField.style.display = 'block';
    } else {
        newAddressField.style.display = 'none';
    }
}

document.getElementById('new-address').addEventListener('input', function(e) {
    var input = e.target.value.toUpperCase().replace(/[ÁÉÍÓÚáéíóú]/g, function(match) {
        var map = { 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U', 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u' };
        return map[match];
    });
    e.target.value = input;
});

function updateTotalCost() {
    var total = 0;
    var breakdown = [];
    var timeSelection = document.querySelector('input[name="attention-time"]:checked');
    var appointmentTime = document.getElementById('appointment-time').value;
    var day = parseInt(document.getElementById('day').value);
    var isValidDay = !isNaN(day) && day >= 1 && day <= 31;

    if (timeSelection) {
        if (timeSelection.value === 'immediate') {
            total += 150;
            breakdown.push('Consulta inmediata: $150');
        } else if (timeSelection.value === 'schedule') {
            total += 50;
            breakdown.push('Agendar cita: $50');
            if (isValidDay) {
                if (day >= 1 && day <= 10) {
                    total += 30;
                    breakdown.push('Días 1-10: $30');
                } else if (day >= 11 && day <= 20) {
                    total += 60;
                    breakdown.push('Días 11-20: $60');
                } else if (day >= 21 && day <= 30) {
                    total += 90;
                    breakdown.push('Días 21-30: $90');
                }
            } else {
                breakdown.push('Fecha no válida');
            }
        }
    }

    if (appointmentTime) {
        var hour = parseInt(appointmentTime.split(':')[0]);
        if (hour >= 10 && hour <= 12) {
            total += 20;
            breakdown.push('Hora 10:00 AM - 12:00 PM: $20');
        } else if (hour >= 13 && hour <= 16) {
            total += 40;
            breakdown.push('Hora 1:00 PM - 4:00 PM: $40');
        } else if (hour >= 17 && hour <= 18) {
            total += 60;
            breakdown.push('Hora 5:00 PM - 6:00 PM: $60');
        }
    }

    var totalCostLabel = document.querySelector('label[for="total-cost"]');
    var totalCostInput = document.getElementById('total-cost');
    var costBreakdown = document.getElementById('cost-breakdown');

    if (timeSelection && appointmentTime && (timeSelection.value === 'immediate' || isValidDay)) {
        totalCostLabel.style.display = 'block';
        totalCostInput.style.display = 'block';
        totalCostInput.value = '$' + total;
        costBreakdown.style.display = 'block';
        costBreakdown.innerHTML = breakdown.map(item => `<li>${item}</li>`).join('');
    } else {
        totalCostLabel.style.display = 'none';
        totalCostInput.style.display = 'none';
        costBreakdown.style.display = 'none';
    }
}

function confirmAppointment() {
    var appointmentTime = document.getElementById('appointment-time').value;
    var pet = document.getElementById('pet').value;
    var address = document.getElementById('address').value;
    var timeSelection = document.querySelector('input[name="attention-time"]:checked');
    var day = document.getElementById('day').value;

    if (!appointmentTime || !pet || !address || !timeSelection || (timeSelection.value === 'schedule' && !day)) {
        alert('Todos los campos son obligatorios');
        return;
    }

    alert('La consulta ha sido solicitada con éxito');
    // Limpiar todas las selecciones y poner los campos en blanco
    document.getElementById('appointment-time').selectedIndex = 0;
    document.getElementById('pet').selectedIndex = 0;
    document.getElementById('address').selectedIndex = 0;
    var checkedRadio = document.querySelector('input[name="attention-time"]:checked');
    if (checkedRadio) {
        checkedRadio.checked = false;
    }
    document.getElementById('day').value = '';
    document.getElementById('month').value = '';
    document.getElementById('year').value = '2025';
    document.getElementById('total-cost').value = '';
    document.getElementById('new-address').value = '';
    document.getElementById('new-address').style.display = 'none';
    document.getElementById('cost-breakdown').style.display = 'none';
    toggleDateFields(false); // Ocultar fecha de consulta
}
