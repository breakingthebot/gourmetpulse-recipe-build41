<!-- components/GroceryShoppingList.vue -->
<!-- Printable Grocery Shopping List & Ingredient Aggregator component. -->
<!-- Connects to: stores/recipeStore.ts -->
<!-- Created: 2026-07-25 -->

<script setup lang="ts">
import { computed } from 'vue';
import { useRecipeStore } from '../stores/recipeStore';

const recipeStore = useRecipeStore();

const categories = ['Produce', 'Dairy', 'Pantry', 'Meat/Seafood', 'Spices'];

const groupedItems = computed(() => {
  const map: Record<string, typeof recipeStore.shoppingList> = {};
  categories.forEach((cat) => {
    map[cat] = recipeStore.shoppingList.filter((item) => item.category === cat);
  });
  return map;
});

function downloadTextList() {
  const element = document.createElement('a');
  const file = new Blob([recipeStore.exportShoppingTextList()], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = `grocery-shopping-list-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
</script>

<template>
  <div class="shopping-list-drawer card">
    <div class="drawer-header">
      <div>
        <h3>🛒 Grocery Shopping List Aggregator</h3>
        <p class="subtitle">Aggregate recipe ingredients, check off items at the store, or export for printing.</p>
      </div>

      <div class="header-actions">
        <button @click="recipeStore.triggerPrintShoppingList()" class="btn-action print">
          🖨️ Print / PDF
        </button>
        <button @click="downloadTextList()" class="btn-action txt">
          📄 Download (.txt)
        </button>
        <button @click="recipeStore.clearShoppingList()" class="btn-action clear">
          🗑️ Clear List
        </button>
      </div>
    </div>

    <!-- Progress Meter -->
    <div v-if="recipeStore.shoppingList.length > 0" class="progress-bar-card card">
      <div class="progress-info-row">
        <span>Shopping Progress</span>
        <strong>
          {{ recipeStore.shoppingListProgress.bought }} / {{ recipeStore.shoppingListProgress.total }} Bought ({{ recipeStore.shoppingListProgress.percentage }}%)
        </strong>
      </div>
      <div class="meter-bar">
        <div class="meter-fill" :style="{ width: `${recipeStore.shoppingListProgress.percentage}%` }"></div>
      </div>
    </div>

    <!-- Categorized List -->
    <div v-if="recipeStore.shoppingList.length > 0" class="categories-list">
      <div v-for="cat in categories" :key="cat">
        <div v-if="groupedItems[cat] && groupedItems[cat].length > 0" class="cat-section">
          <h4 class="cat-title">📍 {{ cat.toUpperCase() }}</h4>

          <div class="items-grid">
            <div 
              v-for="item in groupedItems[cat]" 
              :key="item.id"
              class="shop-item-row card"
              :class="{ checked: item.checked }"
              @click="recipeStore.toggleShoppingListItem(item.id)"
            >
              <input 
                type="checkbox" 
                :checked="item.checked"
                @click.stop="recipeStore.toggleShoppingListItem(item.id)"
                class="shop-checkbox"
              />

              <div class="item-details">
                <span class="item-name" :class="{ strikethrough: item.checked }">
                  <strong>{{ item.amount }} {{ item.unit }}</strong> {{ item.name }}
                </span>
                <span class="source-tag">From: {{ item.sourceRecipeTitle }}</span>
              </div>

              <button 
                @click.stop="recipeStore.removeShoppingListItem(item.id)" 
                class="delete-btn"
                title="Remove item"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state card">
      <span class="empty-icon">🛒</span>
      <p class="empty-title">Your Shopping List is Empty</p>
      <p class="empty-desc">Click "🛒 Add Ingredients to Shopping List" on any recipe card to aggregate grocery items here.</p>
    </div>
  </div>
</template>

<style scoped>
.shopping-list-drawer {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(15, 23, 42, 0.85));
  border-color: rgba(245, 158, 11, 0.3);
}

.drawer-header {
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.drawer-header h3 { font-size: 22px; color: var(--text-primary); }
.subtitle { font-size: 14px; color: var(--text-secondary); }

.header-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-action {
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid var(--border-color);
}

.btn-action.print { background: var(--accent-amber); color: #000; border-color: var(--accent-amber); }
.btn-action.txt { background: rgba(255, 255, 255, 0.05); color: var(--text-primary); }
.btn-action.clear { background: rgba(239, 68, 68, 0.15); color: #ef4444; border-color: rgba(239, 68, 68, 0.4); }

.progress-bar-card {
  padding: 14px;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-info-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--text-secondary);
}

.progress-info-row strong { color: var(--accent-amber); }

.meter-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  background: var(--accent-amber);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.cat-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cat-title {
  font-size: 12px;
  font-weight: 800;
  color: var(--accent-amber);
  letter-spacing: 1px;
}

.items-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
}

.shop-item-row {
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.shop-item-row.checked {
  opacity: 0.6;
  background: rgba(245, 158, 11, 0.05);
}

.shop-checkbox {
  width: 18px;
  height: 18px;
  accent-color: var(--accent-amber);
  cursor: pointer;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-name {
  font-size: 14px;
  color: var(--text-primary);
}

.strikethrough {
  text-decoration: line-through;
  color: var(--text-muted);
}

.source-tag {
  font-size: 11px;
  color: var(--text-muted);
}

.delete-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 14px;
  cursor: pointer;
}

.delete-btn:hover { color: #ef4444; }

.empty-state {
  padding: 40px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.3);
}

.empty-icon { font-size: 42px; }
.empty-title { font-size: 18px; font-weight: 700; color: var(--text-primary); }
.empty-desc { font-size: 13px; color: var(--text-muted); max-width: 420px; }
</style>
