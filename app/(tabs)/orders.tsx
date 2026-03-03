import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';

export default function OrdersScreen() {
  const Colors = useThemeColors();
  const styles = createStyles(Colors);
    return (
        <View style={styles.container}>
            <Text style={styles.icon}>▣</Text>
            <Text style={styles.title}>Commandes</Text>
            <Text style={styles.subtitle}>Bientôt disponible ✦</Text>
        </View>
    );
}

const createStyles = (Colors: any) => StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.obsidian, alignItems: 'center', justifyContent: 'center', gap: 12 },
    icon: { fontSize: 40, color: Colors.warm },
    title: { fontSize: 22, fontFamily: Typography.bold, color: Colors.cream, letterSpacing: -0.5 },
    subtitle: { fontSize: 14, fontFamily: Typography.regular, color: Colors.muted },
});
