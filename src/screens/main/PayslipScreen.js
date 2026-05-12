import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import axiosClient from '../../api/axiosClient';
import { AuthContext } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PRIMARY = '#1A365D';
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const DEMO_PAYSLIPS = [
  { _id: 'p1', month: 4, year: 2025, basicSalary: 25000, hra: 5000, da: 2500, deductions: 3000, netSalary: 29500, status: 'paid' },
  { _id: 'p2', month: 3, year: 2025, basicSalary: 25000, hra: 5000, da: 2500, deductions: 3000, netSalary: 29500, status: 'paid' },
  { _id: 'p3', month: 2, year: 2025, basicSalary: 24000, hra: 4800, da: 2400, deductions: 2800, netSalary: 28400, status: 'paid' },
];

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

function Row({ label, value, valueColor }) {
  return (
    <View style={styles.payRow}>
      <Text style={styles.payRowLabel}>{label}</Text>
      <Text style={[styles.payRowValue, valueColor && { color: valueColor }]}>{value}</Text>
    </View>
  );
}

export default function PayslipScreen() {
  const { user } = useContext(AuthContext);
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => { fetchPayslips(); }, []);

  const fetchPayslips = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/operations/payslips/my');
      setPayslips(res.data || []);
    } catch {
      setPayslips(DEMO_PAYSLIPS);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => setSelected(item)} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardMonth}>{MONTHS[(item.month || 1) - 1]} {item.year}</Text>
        <View style={[styles.badge, { backgroundColor: item.status === 'paid' ? '#4ade80' : '#fbbf24' }]}>
          <Text style={styles.badgeText}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <View>
          <Text style={styles.netLabel}>Net Salary</Text>
          <Text style={styles.netValue}>{fmt(item.netSalary)}</Text>
        </View>
        <Icon name="chevron-right" size={24} color="#94a3b8" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>My Payslips</Text>
        <Text style={styles.subheading}>{user?.name || 'Employee'}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={PRIMARY} style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={payslips}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Icon name="file-document-outline" size={64} color="#cbd5e1" />
              <Text style={styles.emptyText}>No payslips found</Text>
            </View>
          }
        />
      )}

      {/* Detail Modal */}
      <Modal visible={!!selected} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selected ? `${MONTHS[(selected.month || 1) - 1]} ${selected.year}` : ''}
              </Text>
              <TouchableOpacity onPress={() => setSelected(null)}>
                <Icon name="close-circle" size={28} color="#94a3b8" />
              </TouchableOpacity>
            </View>
            {selected && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionLabel}>EARNINGS</Text>
                <Row label="Basic Salary" value={fmt(selected.basicSalary)} />
                <Row label="HRA"          value={fmt(selected.hra)} />
                <Row label="DA"           value={fmt(selected.da)} />
                <View style={styles.divider} />
                <Text style={styles.sectionLabel}>DEDUCTIONS</Text>
                <Row label="Total Deductions" value={fmt(selected.deductions)} valueColor="#ef4444" />
                <View style={styles.dashedDivider} />
                <View style={styles.netRow}>
                  <Text style={styles.netRowLabel}>Net Salary</Text>
                  <Text style={styles.netRowValue}>{fmt(selected.netSalary)}</Text>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { backgroundColor: PRIMARY, paddingTop: 24, paddingBottom: 24, paddingHorizontal: 20, marginBottom: 16 },
  heading: { color: '#ffffff', fontSize: 22, fontWeight: '700' },
  subheading: { color: '#bfdbfe', fontSize: 14, marginTop: 4 },
  card: {
    backgroundColor: '#ffffff', borderRadius: 20, marginBottom: 16,
    overflow: 'hidden', borderWidth: 1, borderColor: '#f1f5f9',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  cardHeader: {
    backgroundColor: PRIMARY, paddingHorizontal: 20, paddingVertical: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  cardMonth: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#ffffff', textTransform: 'capitalize' },
  cardBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  netLabel: { fontSize: 12, color: '#6b7280', marginBottom: 4 },
  netValue: { fontSize: 24, fontWeight: '800', color: PRIMARY },
  emptyState: { alignItems: 'center', marginTop: 80 },
  emptyText: { fontSize: 16, color: '#94a3b8', marginTop: 16 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalSheet: { backgroundColor: '#ffffff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: PRIMARY },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#94a3b8', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' },
  payRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  payRowLabel: { fontSize: 15, color: '#4b5563' },
  payRowValue: { fontSize: 15, fontWeight: '600', color: '#1f2937' },
  divider: { borderTopWidth: 1, borderTopColor: '#e5e7eb', marginVertical: 12 },
  dashedDivider: { borderTopWidth: 1, borderStyle: 'dashed', borderTopColor: '#d1d5db', marginVertical: 12 },
  netRow: { backgroundColor: PRIMARY, borderRadius: 14, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  netRowLabel: { color: '#ffffff', fontSize: 17, fontWeight: '700' },
  netRowValue: { color: '#ffffff', fontSize: 20, fontWeight: '800' },
});
