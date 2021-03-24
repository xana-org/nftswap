const formatNumber = (x, decimals) => {
    const parts = x.toFixed(decimals).split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	if (parts[1] === "0".repeat(decimals)) {
        return parts[0];
    }
	return parts.join(".");
}

export {
    formatNumber,
};