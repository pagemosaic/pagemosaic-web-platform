export function getIdFromPK(pk?: string): string {
    if (pk) {
        if (pk.includes('#')) {
            const parts = pk.split('#');
            return parts[1];
        }
        return pk;
    }
    return '';
}
